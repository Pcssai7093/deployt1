const cloudinary = require("cloudinary").v2;
const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();
const path = require("path");
const multer = require("multer");

const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).array("images", 2);

function bufferParser(req) {
  let imageData = [];
  for (let i = 0; i < 2; i++) {
    imageData.push(
      parser.format(
        path.extname(req.files[i].originalname).toString(),
        req.files[i].buffer
      ).content
    );
  }
  // return parser.format(path.extname(req.file.originalname).toString(), req.file.buffer).content
  return imageData;
}

cloudinary.config({
  cloud_name: process.env.cloudinaryCloudName,
  api_key: process.env.cloudinaryApiKey,
  api_secret: process.env.cloudinaryApiSecret,
});

exports.cloudinary = cloudinary;
exports.bufferParser = bufferParser;
exports.multerUploads = multerUploads;
