// const fs = require('fs');
// const path = require('path');
// const Model = require("../models");

// // Directory where images are stored
// const imagesDir = path.join(__dirname, 'images');

// // Function to delete images older than 7 days
// function deleteOldImages() {
//     const now = Date.now();
//     const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;

//     fs.readdir(imagesDir, (err, files) => {
//         if (err) {
//             console.error('Error reading images directory:', err);
//             return;
//         }
//         const chats = await Model.Chat

//         files.forEach(file => {
//             const filePath = path.join(imagesDir, file);
//             fs.stat(filePath, (err, stats) => {
//                 if (err) {
//                     console.error('Error getting file stats:', err);
//                     return;
//                 }

//                 const fileAgeInMs = now - stats.mtimeMs;
//                 if (fileAgeInMs > SEVEN_DAYS_IN_MS) {

//                     fs.unlink(filePath, (err) => {
//                         if (err) {
//                             console.error('Error deleting file:', err);
//                         } else {
//                             console.log(`Deleted old image: ${file}`);
//                         }
//                     });
//                 }
//             });
//         });
//     });
// }

// // Schedule the cleanup job to run daily
// const cron = require('node-cron');
// const { Model } = require('sequelize');
// cron.schedule('0 0 * * *', deleteOldImages); // Runs every day at midnight

// console.log('Image cleanup job scheduled to run daily at midnight.');
