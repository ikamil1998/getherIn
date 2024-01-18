const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "images");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
      cb(null, `${Math.random(1000000000000)}-${file.originalname}`);
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
 exports.uploadImages = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter,
  });