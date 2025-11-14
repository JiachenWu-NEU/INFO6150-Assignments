const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { validationResult, body } = require('express-validator');
const User = require('../models/User');
const {
  emailRule,
  fullNameRule,
  fullNameRequiredRule,
  passwordRule,
  passwordOptionalRule,
} = require('../validators/rules');

// --- Multer setup for /images folder --- //
const imagesDir = path.join(__dirname, '..', 'images');
const publicImagesPath = '/images'; // returned in API
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Invalid file format. Only JPEG, PNG, and GIF are allowed.'));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Helper to format validation errors
function sendValidationErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed.', details: errors.array() });
  }
}

// 1) POST /user/create
router.post(
  '/create',
  [fullNameRequiredRule, emailRule, passwordRule],
  async (req, res) => {
    const err = sendValidationErrors(req, res);
    if (err) return;

    try {
      const { fullName, email, password } = req.body;
      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ error: 'Validation failed.', details: [{ msg: 'email already exists', param: 'email' }] });
      }

      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
      const passwordHash = await bcrypt.hash(password, saltRounds);

      await User.create({ fullName, email, passwordHash });
      return res.status(201).json({ message: 'User created successfully.' });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Server error.' });
    }
  }
);

// 2) PUT /user/edit (identify by email, update fullName and/or password)
router.put(
  '/edit',
  [
    emailRule,
    fullNameRule, // optional
    passwordOptionalRule // optional
  ],
  async (req, res) => {
    const err = sendValidationErrors(req, res);
    if (err) return;

    try {
      const { email, fullName, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: 'User not found.' });

      if (fullName !== undefined) user.fullName = fullName;
      if (password !== undefined) {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
        user.passwordHash = await bcrypt.hash(password, saltRounds);
      }

      await user.save();
      return res.status(200).json({ message: 'User updated successfully.' });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Server error.' });
    }
  }
);

// 3) DELETE /user/delete (by email)
router.delete(
  '/delete',
  [emailRule],
  async (req, res) => {
    const err = sendValidationErrors(req, res);
    if (err) return;

    try {
      const { email } = req.body;
      const user = await User.findOneAndDelete({ email });
      if (!user) return res.status(404).json({ error: 'User not found.' });

      // If user had an image, you may optionally remove the file from disk (not required by spec)
      // if (user.imagePath) {
      //   const p = path.join(__dirname, '..', user.imagePath);
      //   if (fs.existsSync(p)) fs.unlinkSync(p);
      // }

      return res.status(200).json({ message: 'User deleted successfully.' });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Server error.' });
    }
  }
);

// 4) GET /user/getAll
router.get('/getAll', async (req, res) => {
  try {
    const users = await User.find({}, { fullName: 1, email: 1, passwordHash: 1, imagePath: 1, _id: 0 });
    // Per assignment: include password (hashed). We'll return 'passwordHash' field.
    return res.status(200).json({
      users: users.map(u => ({
        fullName: u.fullName,
        email: u.email,
        password: u.passwordHash,
        imagePath: u.imagePath || null
      }))
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// 5) POST /user/uploadImage
router.post('/uploadImage', upload.single('image'), async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Validation failed.', details: [{ msg: 'email is required', param: 'email' }] });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    if (user.imagePath) {
      return res.status(400).json({ error: 'Image already exists for this user.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Invalid file format. Only JPEG, PNG, and GIF are allowed.' });
    }

    const path = require('path');
    const fs = require('fs');
    const imagesDir = require('path').join(__dirname, '..', 'images');

    const ext = req.file.mimetype === 'image/jpeg' ? '.jpg'
              : req.file.mimetype === 'image/png'  ? '.png'
              : '.gif';
    const filename = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
    const fullPath = require('path').join(imagesDir, filename);
    require('fs').writeFileSync(fullPath, req.file.buffer);

    user.imagePath = '/images/' + filename;
    await user.save();

    return res.status(201).json({ message: 'Image uploaded successfully.', filePath: user.imagePath });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
