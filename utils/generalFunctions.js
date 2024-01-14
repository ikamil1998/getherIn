const multer = require("multer");
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
export const uploadImages = multer({
    storage,
    fileFilter,
  });