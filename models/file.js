const mongoose = require('mongoose');

const fileSchema = mongoose.Schema({
  courseTitle: { type: String, default: null},
  courseImage: {
    filename: { type: String, },
    Url: { type: String, },
  },
},
{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
module.exports = mongoose.model("File", fileSchema);