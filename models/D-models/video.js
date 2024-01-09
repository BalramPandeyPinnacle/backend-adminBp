const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    key: String,
    originalname: String,
    mimetype: String,
    size: Number,
    videoFile: { type: String},
    s3Key: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;