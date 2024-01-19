const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "images");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
      cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "files");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
      cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" || 
      file.mimetype === "image/gif"  ||
      file.mimetype === "image/tiff"  ||
      file.mimetype === "image/heic"  
    ) {
      cb(null, true);
    } else {
      cb(
        new Error("Unsupported image type .. should be [jpg - jpeg - png, gif, tiff, heic ]"),
        false
      );
    }
  };
const pdfFilter = (req, file, cb) => {
    if (
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error("Unsupported type you should upload file with pdf extention]"),
        false
      );
    }
  };
 exports.uploadImages = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter,
  });
exports.uploadPdf = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    pdfFilter,
  });