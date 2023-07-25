// const express = require('express');
// const multer = require('multer');
// const path = require('path');

// const app = express();
// const upload = multer({ dest: 'uploads/' });

// const PORT = process.env.PORT || 3000;

// const firebaseConfig = {
//     apiKey: "AIzaSyCao776w2haJn2rlqxMoBfIo1jMuZNrH_8",
//     authDomain: "filesharing-d534c.firebaseapp.com",
//     projectId: "filesharing-d534c",
//     storageBucket: "filesharing-d534c.appspot.com",
//     messagingSenderId: "351215577513",
//     appId: "1:351215577513:web:6a2ca62f7aeaa99073bcb8",
//     measurementId: "G-PRSQMCHQB2"
//   }
//   firebase.initializeApp(firebaseConfig);

// app.post('/upload', upload.single('file'), (req, res) => {

//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }

//   const admin = require('firebase-admin');
//   const serviceAccount = require('filesharing-d534c-firebase-adminsdk-6gh7n-9e355a59a9.json'); 
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     storageBucket: 'gs://filesharing-d534c.appspot.com',
//   });

//   const bucket = admin.storage().bucket();
//   const fileUploadPath = `uploads/${req.file.originalname}`;

//   bucket.upload(req.file.path, {
//     destination: fileUploadPath,
//     metadata: {
//       contentType: req.file.mimetype,
//       metadata: {
//         custom: 'metadata',
//       },
//     },
//   }, (err) => {
//     if (err) {
//       return res.status(500).send('Error uploading the file to Firebase Storage.');
//     }

//     const fileId = generateUniqueId(); 
//     const fileUrl = `https://firebasestorage.googleapis.com/v0/b/your-firebase-storage-bucket-url/o/${encodeURIComponent(fileUploadPath)}?alt=media`;

//     res.send({
//       fileId,
//       fileUrl,
//     });
//   });
// });


const express = require('express');
const multer = require('multer');
const path = require('path');
const admin = require('firebase-admin');

const app = express();
const upload = multer({ dest: 'uploads/' });

const PORT = process.env.PORT || 3000;

const firebaseConfig = {
    apiKey: "AIzaSyCao776w2haJn2rlqxMoBfIo1jMuZNrH_8",
    authDomain: "filesharing-d534c.firebaseapp.com",
    projectId: "filesharing-d534c",
    storageBucket: "filesharing-d534c.appspot.com",
    messagingSenderId: "351215577513",
    appId: "1:351215577513:web:6a2ca62f7aeaa99073bcb8",
    measurementId: "G-PRSQMCHQB2"
  };
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: firebaseConfig.storageBucket,
});

// Function to generate a unique ID for files (you can use your own implementation)
function generateUniqueId() {
  // Your unique ID generation logic goes here
  return Math.random().toString(36).substr(2, 9);
}

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const bucket = admin.storage().bucket();
  const fileUploadPath = `uploads/${req.file.originalname}`;

  bucket.upload(req.file.path, {
    destination: fileUploadPath,
    metadata: {
      contentType: req.file.mimetype,
      metadata: {
        custom: 'metadata',
      },
    },
  }, (err) => {
    if (err) {
      return res.status(500).send('Error uploading the file to Firebase Storage.');
    }

    const fileId = generateUniqueId();
    const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${encodeURIComponent(fileUploadPath)}?alt=media`;

    res.send({
      fileId,
      fileUrl,
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



