const mongoose = require('mongoose');
const { Schema } = mongoose;

const CompanySchema = new Schema({
  name:        { type: String, required: true, trim: true },
  website:     { type: String, default: '' },
  description: { type: String, default: '' },
  imagePath:   { type: String, default: null },
  tags:        { type: [String], default: [] },
  isActive:    { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Company', CompanySchema);