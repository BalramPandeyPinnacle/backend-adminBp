// const mongoose = require('mongoose');

// const courseSchema = mongoose.Schema({
//     courseTitle: String,
//     courseDetails: String,
//     teacherName: String,
//     category:String,
//     SEOCode:String,
//     rating: Number,
//     price: Number,
// },
// {timestamps:{ createdAt: 'created_at', updatedAt: 'updated_at'}});
//     module.exports = mongoose.model("Course", courseSchema);

const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    courseTitle: {
        type: String,
        required: true
    },
    courseDetails: {
        type: String,
        required: true
    },
    teacherName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    SEOCode: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
},
{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model("Course", courseSchema);
