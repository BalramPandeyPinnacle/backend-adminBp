const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  title: String,
  selectedVideo: String,
  pdfTitle: String,
  selectedPdf: String,
  serialNumber: Number,
});

const daySchema = new mongoose.Schema({
  dayNumber: Number,
  topics: [topicSchema],
});

const chapterSchema = new mongoose.Schema({
  chapterNumber: Number,
  chapterTitle: String,
  courseId: String, 
  days: [daySchema],
});

const Chapter = mongoose.model("Chapter", chapterSchema);

module.exports = Chapter;