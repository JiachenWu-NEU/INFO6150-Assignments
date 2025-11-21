const mongoose = require('mongoose');
const { Schema } = mongoose;

const JobSchema = new Schema({
  title:       { type: String, required: true, trim: true },
  company:     { type: String, required: true, trim: true },
  description: { type: String, required: true },
  location:    { type: String, default: '' },
  salary:      { type: String, default: '' },
  tags:        { type: [String], default: [] },
  isActive:    { type: Boolean, default: true },

  postedBy:    { type: Schema.Types.ObjectId, ref: 'User', required: true } // admin
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);