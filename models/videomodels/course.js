const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    courseTitle: String,
    courseDetails: String,
    teacherName: String,
    category:String,
    rating: Number,
    price: Number,
},
{timestamps:{ createdAt: 'created_at', updatedAt: 'updated_at'}});
    module.exports = mongoose.model("Course", courseSchema);