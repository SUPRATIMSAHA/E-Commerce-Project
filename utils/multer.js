const multer = require("multer");
const path = require("path");

const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (
      ext !== ".jpg" &&
      ext !== ".jfif" &&
      ext !== ".gif" &&
      ext !== ".jpeg" &&
      ext !== ".png"
    ) {
      return cb(new Error("File type is not supported"), false);
    }
    cb(null, true);
  },
});

module.exports = upload;
