const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  key: String,
  originalname: String,
  mimetype: String,
  size: Number,
  pdfFile: Buffer, 
  s3Key: { type: String },
}, {
  timestamps: true,
});

const PDF = mongoose.model('PDF', pdfSchema);

module.exports = PDF;
