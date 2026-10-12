const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadPath = path.join(
  __dirname,
  "..",
  "uploads",
  "products"
);

console.log("UPLOAD PATH:", uploadPath);

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("UPLOAD FOLDER CREATED");
}

console.log("FOLDER EXISTS:", fs.existsSync(uploadPath));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("MULTER DESTINATION:", uploadPath);
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1E9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage
});

module.exports = upload;