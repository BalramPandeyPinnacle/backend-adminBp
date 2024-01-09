const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  pdfUrl: {
    type: String,
    required: false, // Set to true if PDF is required
  },
  isPdfDownloadable:{
    type: Boolean,
    default: false, // Set to true if the PDF is downloadable by default
  },
});

const daySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  dayNumber: {
    type: Number,
    required: true,
  },
  topics: [topicSchema],
});

const courseContentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  days: [daySchema],
});

const CourseContent = mongoose.model('CourseContent', courseContentSchema);

module.exports = CourseContent;