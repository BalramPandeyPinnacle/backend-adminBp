const mongoose = require('mongoose');
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
    
  },{timestamps:{ createdAt: 'created_at', updatedAt: 'updated_at'}});
    module.exports = mongoose.model("Course", courseSchema);


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