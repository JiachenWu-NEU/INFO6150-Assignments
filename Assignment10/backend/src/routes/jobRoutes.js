const express = require('express');
const { body, param, query } = require('express-validator');
const { handleValidation } = require('../middleware/validate');
const { authRequired, requireRole } = require('../middleware/auth');
const Job = require('../models/Job');

const router = express.Router();

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
        { title: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    if (tag) filter.tags = tag;

    const jobs = await Job.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ jobs });
  }
);

router.get(
  '/:id',
  [ param('id').isMongoId() ],
  handleValidation,
  async (req, res) => {
    const job = await Job.findById(req.params.id).lean();
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  }
);

router.post(
  '/',
  authRequired, requireRole('admin'),
  [
    body('title').isString().isLength({ min: 2 }),
    body('company').isString().isLength({ min: 2 }),
    body('description').isString().isLength({ min: 10 }),
    body('location').optional().isString(),
    body('salary').optional().isString(),
    body('tags').optional().isArray()
  ],
  handleValidation,
  async (req, res) => {
    const payload = {
      title: req.body.title,
      company: req.body.company,
      description: req.body.description,
      location: req.body.location || '',
      salary: req.body.salary || '',
      tags: Array.isArray(req.body.tags) ? req.body.tags : [],
      postedBy: req.user.id
    };
    const doc = await Job.create(payload);
    res.status(201).json({ message: 'Job created', id: doc._id });
  }
);

router.put(
  '/:id',
  authRequired, requireRole('admin'),
  [
    param('id').isMongoId(),
    body('title').optional().isString().isLength({ min: 2 }),
    body('company').optional().isString().isLength({ min: 2 }),
    body('description').optional().isString().isLength({ min: 10 }),
    body('location').optional().isString(),
    body('salary').optional().isString(),
    body('tags').optional().isArray(),
    body('isActive').optional().isBoolean()
  ],
  handleValidation,
  async (req, res) => {
    const update = { ...req.body };
    const doc = await Job.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!doc) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job updated' });
  }
);

router.delete(
  '/:id',
  authRequired, requireRole('admin'),
  [ param('id').isMongoId() ],
  handleValidation,
  async (req, res) => {
    const doc = await Job.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job deleted' });
  }
);

module.exports = router;