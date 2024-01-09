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