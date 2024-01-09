const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const AWS = require('aws-sdk');
const Video = require('./models/video');
const PDF = require('./models/pdf');
const cors = require('cors');
const { generatePresignedUrl } = require('./getvideo')
// Import the necessary models
const Chapter = require('./models/courseContent')
const app = express();

const PORT = process.env.PORT || 3001;

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.aws_region,
});

const s3 = new AWS.S3();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb+srv://Aryan:Deep1177@videos.ffkkrtk.mongodb.net/Video_Edemy_Pinnacle?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const Course = require("./models/course")


// // POST a new course
app.post('/api/courses', async (req, res) => {
  const {
    courseTitle,
    courseDetails,
    teacherName,
    category,
    rating,
    price,
    mrp,
  } = req.body;

  try {
    const newCourse = new Course({
      courseTitle,
      courseDetails,
      teacherName,
      category,
      rating,
      price,
      mrp,
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Get courses
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Video upload API
app.post('/api/upload-video', upload.single('video'), async (req, res) => {
  try {
    const { originalname, mimetype, size } = req.file;

    const params = {
      Bucket: 'videocoursespinnacle',
      Key: `videos/${originalname}`, 
      Body: req.file.buffer,
      ContentType: mimetype,
      ContentLength: size,
    };

    const s3Data = await s3.upload(params).promise();

    const video = new Video({ s3Key: s3Data.Key, originalname, mimetype, size });
    const savedVideo = await video.save();

    res.json(savedVideo);
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// // Get all videos API
// app.get('/api/get-videos', async (req, res) => {
//     try {
//       const videos = await Video.find();
//       res.json(videos);
//     } catch (error) {
//       console.error('Error fetching videos:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });
  
//   app.get('/api/get-videos', async (req, res) => {
//     try {
//       // Replace 'Video' with the actual Mongoose model you are using
//       const videoData = await Video.find({}, '_id filename s3Key chapter');
  
//       const videoDataWithUrls = await Promise.all(videoData.map(async (video) => ({
//         ...video.toObject(),
//         url: await generatePresignedUrl(video.s3Key),
//       })));
  
//       res.json(videoDataWithUrls);
//     } catch (error) {
//       console.error('Error fetching video data:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });

// // PDF upload API
// app.post('/api/upload-pdf', upload.single('pdf'), async (req, res) => {
//   try {
//     const { originalname, mimetype, size } = req.file;

//     const params = {
//       Bucket: 'videocoursespinnacle',
//       Key: `pdfs/${originalname}`, 
//       Body: req.file.buffer,
//       ContentType: mimetype,
//       ContentLength: size,
//     };

//     const s3Data = await s3.upload(params).promise();
//     const pdf = new PDF({ s3Key: s3Data.Key, originalname, mimetype, size });
//     const savedPDF = await pdf.save();

//     res.json(savedPDF);
//   } catch (error) {
//     console.error('Error uploading PDF:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Get all PDFs API
// // Inside your route handler
// app.get('/api/get-pdfs', async (req, res) => {
//     try {
//       const pdfData = await PDF.find({}, '_id filename s3Key chapter');
//       const pdfDataWithUrls = await Promise.all(pdfData.map(async (pdf) => ({
//         ...pdf.toObject(),
//         url: await generatePresignedUrl(pdf.s3Key),
//       })));
  
//       res.json(pdfDataWithUrls);
//     } catch (error) {
//       console.error('Error fetching PDF data:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
// });


// Video data fetching API
app.get('/api/get-videos', async (req, res) => {
  try {
    const videoData = await Video.find({}, '_id filename s3Key chapter');

    const videoDataWithUrls = await Promise.all(videoData.map(async (video) => {
      const url = await generatePresignedUrl(video.s3Key); 
      return { ...video.toObject(), url };
    }));

    res.json(videoDataWithUrls);
  } catch (error) {
    console.error('Error fetching video data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PDF data fetching API
app.get('/api/get-pdfs', async (req, res) => {
  try {
    const pdfData = await PDF.find({}, '_id filename s3Key chapter');

    const pdfDataWithUrls = await Promise.all(pdfData.map(async (pdf) => {
      const url = await generatePresignedUrl(pdf.s3Key); // Remove .promise()
      return { ...pdf.toObject(), url };
    }));

    res.json(pdfDataWithUrls);
  } catch (error) {
    console.error('Error fetching PDF data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// PDF upload API
app.post('/api/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    const { originalname, mimetype, size } = req.file;

    const params = {
      Bucket: 'videocoursespinnacle',
      Key: `pdfs/${originalname}`,
      Body: req.file.buffer,
      ContentType: mimetype,
      ContentLength: size,
    };

    const s3Data = await s3.upload(params).promise();
    const pdf = new PDF({ s3Key: s3Data.Key, originalname, mimetype, size });
    const savedPDF = await pdf.save();

    res.json(savedPDF);
  } catch (error) {
    console.error('Error uploading PDF:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
///adding courseContent

app.post("/api/saveChapter", async (req, res) => {
  try {
    const { dayNumber, chapterNumber, chapterTitle, courseId, days } = req.body;

    // Save data to MongoDB using Mongoose
    const newChapter = await Chapter.create({
      dayNumber,
      chapterNumber,
      chapterTitle,
      courseId,
      days,
    });

    res.status(201).json(newChapter);
  } catch (error) {
    console.error("Error saving chapter:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


  // GET API to retrieve all chapters
app.get('/api/get-chapters', async (req, res) => {
    try {
      // Populate the 'topics' field in the Chapter model to get the actual topic data
      const chapters = await Chapter.find().populate('topics');
  
      // Customize the response format as needed
      const formattedChapters = chapters.map((chapter) => ({
        dayNumber: chapter.dayNumber,
        chapterNumber: chapter.chapterNumber,
        chapterTitle: chapter.chapterTitle,
        topics: chapter.topics.map((topic) => ({
          serialNumber: topic.serialNumber,
          title: topic.title,
          selectedVideo: topic.selectedVideo,
          pdfTitle: topic.pdfTitle,
          selectedPdf: topic.selectedPdf,
        })),
      }));
  
      res.json(formattedChapters);
    } catch (error) {
      console.error('Error fetching chapters:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});