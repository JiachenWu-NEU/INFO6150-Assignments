const express = require('express');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const { body } = require('express-validator');
const { handleValidation } = require('../middleware/validate');
const User = require('../models/User');

const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('invalid email'),
    body('password').isString().isLength({ min: 1 })
  ],
  handleValidation,
  async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Wrong email or password' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Wrong email or password' });

    const token = jwt.sign({ sub: user.email }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '2h' });
    res.json({ token, role: user.role, fullName: user.fullName });
  }
);

router.post(
  '/register',
  [
    body('fullName').isString().isLength({ min: 2 }).trim(),
    body('email').isEmail(),
    body('password').isStrongPassword({
      minLength: 8, minLowercase:1, minUppercase:1, minNumbers:1, minSymbols:1
    })
  ],
  handleValidation,
  async (req, res) => {
    const { fullName, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'email already exists' });

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const doc = await User.create({ fullName, email, passwordHash, role: 'employee' });
    return res.status(201).json({ message: 'Registered', id: doc._id });
  }
);

module.exports = router;