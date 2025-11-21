const express = require('express');
const { body, query } = require('express-validator');
const { handleValidation } = require('../middleware/validate');
const { authRequired, requireRole } = require('../middleware/auth');
const Company = require('../models/Company');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const imagesDir = path.join(__dirname, '..', '..', 'images');
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imagesDir),
  filename: (req, file, cb) => {
    const map = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif' };
    const ext = map[file.mimetype] || path.extname(file.originalname) || '';
    const name = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
    cb(null, name);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ['image/jpeg', 'image/png', 'image/gif'].includes(file.mimetype);
    if (!ok) return cb(new Error('Invalid file format. Only JPEG, PNG, and GIF are allowed.'));
    cb(null, true);
  }
});

router.get(
  '/',
  [
    query('q').optional().isString(),
    query('tag').optional().isString()
  ],
  handleValidation,
  async (req, res) => {
    const { q, tag } = req.query;
    const filter = { isActive: true };
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    if (tag) filter.tags = tag;

    const companies = await Company.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ companies });
  }
);

router.post(
  '/',
  authRequired, requireRole('admin'),
  upload.single('image'),
  [
    body('name').isString().isLength({ min: 2 }).withMessage('name too short'),
    body('website').optional().isString(),
    body('description').optional().isString(),
  ],
  handleValidation,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Image is required (JPEG/PNG/GIF, <=5MB).' });
      }

      let tags = [];
      const rawTags = req.body.tags;
      if (Array.isArray(rawTags)) {
        tags = rawTags.map(String).map(s => s.trim()).filter(Boolean);
      } else if (typeof rawTags === 'string') {
        try {
          const maybeArr = JSON.parse(rawTags);
          if (Array.isArray(maybeArr)) {
            tags = maybeArr.map(String).map(s => s.trim()).filter(Boolean);
          } else {
            tags = rawTags.split(',').map(s => s.trim()).filter(Boolean);
          }
        } catch {
          tags = rawTags.split(',').map(s => s.trim()).filter(Boolean);
        }
      }

      const imageRelPath = '/images/' + req.file.filename;
      const doc = await Company.create({
        name:        (req.body.name || '').trim(),
        website:     (req.body.website || '').trim(),
        description: (req.body.description || '').trim(),
        imagePath:   imageRelPath,
        tags
      });

      return res.status(201).json({
        message: 'Company created',
        id: doc._id,
        imagePath: imageRelPath
      });
    } catch (e) {
      if (e && e.message && /Invalid file format/i.test(e.message)) {
        return res.status(400).json({ error: e.message });
      }
      console.error('CREATE COMPANY ERROR:', e);
      return res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;
