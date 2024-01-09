const express=require('express');
const cors=require('cors');
const morgan =require('morgan');
const { readdirSync } = require('fs');
const mongoose=require('mongoose');
const Course=require('./models/course');
const User=require('./models/user');
const CourseContent=require('./models/courseContent');
const multer=require("multer");
const multerS3=require('multer-s3')
const aws = require('aws-sdk');
const path = require('path');
const File=require("./models/file")
require('dotenv').config();
//create express app
const app=express();
//DataBase
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
  })
  .then(() =>
  console.log("**** Database Connected ****"))
  .catch((error) => console.log(`*** Database Connection Error: ${error} ***`));
// apply Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use((req,res,next)=>{
console.log("Middleware Function");
next();
})

//file upload schema
// Create a mongoose model for storing file information
// const File = mongoose.model('File', {
//   filename: String,
//   s3Url: String,
// });

// Configure AWS
aws.config.update({
  accessKeyId: '',
  secretAccessKey: '',
  region: 'ap-south-1',
});

const s3 = new aws.S3();
// Configure multer and multer-s3 to handle file uploads
// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: 'videocoursespinnacle',
//     acl: 'public-read',
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString());
//     },
//   }),
// });


// student Routes

app.get("/student",async(req,res)=>{
  const student= await User.find();
  res.send(student);
})

app.get("/student/:id",async(req,res)=>{
  const result=await User.findOne({_id:req.params.id});
  if(result){
  res.send(result)
  } 
  else{
    res.send({message: "No Course Found "})
  }
})

app.delete('/student/:id',async(req,res)=>{
  const result= await User.deleteOne({_id:req.params.id});
    res.send(result);
  });

// Courses Routes

// app.post("/add-course",async(req,res)=>{
//   try{
//     const course=new Course(req.body);
//     const result=course.save();
//     res.send(course);
//   }
//   catch(err){
//     console.log(err);
//   }

// })

app.post("/add-course", async (req, res) => {
  try {
      // Check if any required field is empty
      const requiredFields = ['courseTitle', 'courseDetails', 'teacherName', 'category', 'SEOCode', 'rating', 'price'];

      for (const field of requiredFields) {
          if (!req.body[field]) {
              return res.status(400).json({ error: `${field} is required.` });
          }
      }

      const course = new Course(req.body);
      const result = await course.save();
      res.send(course);
  } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'Internal Server Error' });
  }
});

// get All Courses
app.get("/courses",async(req,res)=>{
  const courses= await Course.find();
  res.send(courses);
})

app.get("/course/:id",async(req,res)=>{
    const result=await Course.findOne({_id:req.params.id});
  if(result){
  res.send(result)
  } 
  else{
    res.send({message: "No Course Found "})
  }
})
app.delete('/course/:id',async(req,res)=>{
const result= await Course.deleteOne({_id:req.params.id});
  res.send(result);
});


app.put('/course/:id',async(req,res)=>{
  let result=await Course.updateOne({_id:req.params.id},{$set:req.body});
  res.send(result);
})
app.get("/recentCourses", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: 1 });
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error"});
  }
})

// Fetch items in descending order of the createdAt timestamp
app.get("/recentCoursesDescending", async (req, res) => {
  try {
    const coursesDescending = await Course.find().sort({ createdAt: -1 });
    res.json(coursesDescending);
  } catch (error){
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//Filtering ssc courses
app.get("/courses/ssc", async (req, res) => {
  try {
    const sscCourses = await Course.find({ category:"ssc" });
    res.json(sscCourses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//filtering railway
app.get("/courses/railway", async (req, res) => {
  try {
    const RailwayCourses = await Course.find({ category: "railway" });
    res.json(RailwayCourses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



//Search API
app.get('/search/:key',async(req,res)=>{
  let result=await Course.find({
    "$or":[
      // {courseTitle:{$regex:req.params.key.toUpperCase()}},
      // {courseTitle:{$regex:req.params.key.toLowerCase()}},
      {courseTitle:{$regex:req.params.key}},
      // {teacherName:{$regex:req.params.key.toUpperCase()}},
      // {teacherName:{$regex:req.params.key.toLowerCase()}},
      {teacherName:{$regex:req.params.key}}
    ]
  });
  res.send(result);
})
// Get all purchased courses for a specific user
app.get('/purchased-courses/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the list of purchased course IDs from the user document
    const purchasedCourseIds = user.purchasedCourses || [];

    // Find the purchased courses using the IDs
    const purchasedCourses = await Course.find({ _id: { $in: purchasedCourseIds } });

    res.json({ success: true, purchasedCourses });
  } catch (error) {
    console.error('Error while fetching purchased courses:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});




app.post('/purchase/:userId/:courseId', async (req, res) => {
  try {
    const userId = req.params.userId; // Get the user ID from the request parameters
    const courseId = req.params.courseId; // Get the course ID from the request parameters

    // Update the user document with the purchased course
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { purchasedCourses: courseId } },
      { new: true }
    );

    // Handle the result, send a response, etc.
    res.json({ success: true, message: 'Course purchased successfully', user });
  } catch (error) {
    console.error('Error during purchase:', error);
    res.status(500).json({ success: false, message: 'Failed to purchase course', error: error.message });
  }
});


// Add course to user's cart
app.post('/add-to-cart/:userId/:courseId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const courseId = req.params.courseId;

    // Update the user document with the added course to the cart
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { addToCart: courseId } },
      { new: true }
    );

    res.json({ success: true, message: 'Course added to cart successfully', user });
  } catch (error) {
    console.error('Error while adding to cart:', error);
    res.status(500).json({ success: false, message: 'Failed to add course to cart', error: error.message });
  }
});

// Get all courses in user's cart
app.get('/cart/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the list of course IDs in the user's cart
    const cartCourseIds = user.addToCart || [];

    // Find the courses using the IDs
    const cartCourses = await Course.find({ _id: { $in: cartCourseIds } });

    res.json({ success: true, cartCourses });
  } catch (error) {
    console.error('Error while fetching cart courses:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});
// Add course to user's wishlist
app.post('/add-to-wishlist/:userId/:courseId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const courseId = req.params.courseId;

    // Update the user document with the added course to the wishlist
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { WishList: courseId } },
      { new: true }
    );

    res.json({ success: true, message: 'Course added to wishlist successfully', user });
  } catch (error) {
    console.error('Error while adding to wishlist:', error);
    res.status(500).json({ success: false, message: 'Failed to add course to wishlist', error: error.message });
  }
});

// Get all courses in user's wishlist
app.get('/wishlist/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the list of course IDs in the user's wishlist
    const wishlistCourseIds = user.WishList || [];

    // Find the courses using the IDs
    const wishlistCourses = await Course.find({ _id: { $in: wishlistCourseIds } });

    res.json({ success: true, wishlistCourses });
  } catch (error) {
    console.error('Error while fetching wishlist courses:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});


// Create new course content
app.post('/add-courseContent', async (req, res) => {
  try {
    const courseContent = new CourseContent(req.body);
    const result = await courseContent.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all course content for a specific course
app.get('/courseContent/:courseId', async (req, res) => {
  try {
    const courseContent = await CourseContent.find({ courseId: req.params.courseId });
    res.json(courseContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.use(express.urlencoded({extended:false}));
const upload=multer({dest:"upload/"});

app.post("/uploadImage",upload.single("courseImage"),(req,res)=>{
  console.log(req.body);
  console.log(req.file);

  try{
    const file=new File(req.body);
    const result=file.save();
    res.send(result);
  }
  catch(err){
    console.log(err);
  }


})
//routes
readdirSync("./routes").map((r)=>app.use("/api",require(`./routes/${r}`)));
//PORT
const port = process.env.PORT||8000;
app.listen(port,()=>{
console.log (`server is running on port ${port}`);
})
