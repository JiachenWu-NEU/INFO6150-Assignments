const express = require('express');
const { body, param } = require('express-validator');
const { handleValidation } = require('../middleware/validate');
const { authRequired, requireRole } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.get('/', authRequired, requireRole('admin'), async (req, res) => {
  const users = await User.find({}, { fullName:1, email:1, role:1, passwordHash:1 }).lean();
  res.json({
    users: users.map(u => ({
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      password: u.passwordHash
    }))
  });
});

router.post(
  '/',
  authRequired, requireRole('admin'),
  [
    body('fullName').isString().isLength({ min: 2 }).trim(),
    body('email').isEmail(),
    body('password').isStrongPassword({
      minLength: 8, minLowercase:1, minUppercase:1, minNumbers:1, minSymbols:1
    }),
    body('role').optional().isIn(['admin','employee'])
  ],
  handleValidation,
  async (req, res) => {
    const { fullName, email, password, role = 'employee' } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'email already exists' });

    const bcrypt = require('bcrypt');
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const doc = await User.create({ fullName, email, passwordHash, role });
    res.status(201).json({ message: 'User created', id: doc._id });
  }
);

router.put(
  '/:id',
  authRequired, requireRole('admin'),
  [
    param('id').isMongoId(),
    body('fullName').optional().isString().isLength({ min: 2 }).trim(),
    body('role').optional().isIn(['admin','employee']),
    body('password').optional().isStrongPassword({
      minLength: 8, minLowercase:1, minUppercase:1, minNumbers:1, minSymbols:1
    })
  ],
  handleValidation,
  async (req, res) => {
    const { id } = req.params;
    const update = {};
    if (req.body.fullName !== undefined) update.fullName = req.body.fullName;
    if (req.body.role !== undefined) update.role = req.body.role;
    if (req.body.password !== undefined) {
      const bcrypt = require('bcrypt');
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
      update.passwordHash = await bcrypt.hash(req.body.password, saltRounds);
    }

    const doc = await User.findByIdAndUpdate(id, update, { new: true });
    if (!doc) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User updated' });
  }
);

router.delete(
  '/:id',
  authRequired, requireRole('admin'),
  [ param('id').isMongoId() ],
  handleValidation,
  async (req, res) => {
    const doc = await User.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  }
);

module.exports = router;