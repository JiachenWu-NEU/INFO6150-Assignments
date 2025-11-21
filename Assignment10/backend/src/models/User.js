const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role:     { type: String, enum: ['admin','employee'], default: 'employee', index: true },

  // 预留：公司/头像图片（Assignment 8/10 后续）
  imagePath: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);