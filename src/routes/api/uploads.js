var express = require('express'),
  router = express.Router(),
  multer = require('multer'),
  fs = require('fs'),
  sharp = require('sharp');

const UPLOAD_PATH = 'uploads/';
const IMAGES_PATH = UPLOAD_PATH + 'images/';
const THUMBS_PATH = UPLOAD_PATH + 'thumbs/';
const DOCUMENTS_PATH = UPLOAD_PATH + 'documents/';
!fs.existsSync(UPLOAD_PATH) && fs.mkdirSync(UPLOAD_PATH);
!fs.existsSync(IMAGES_PATH) && fs.mkdirSync(IMAGES_PATH);
!fs.existsSync(THUMBS_PATH) && fs.mkdirSync(THUMBS_PATH);
!fs.existsSync(DOCUMENTS_PATH) && fs.mkdirSync(DOCUMENTS_PATH);

var imageStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, IMAGES_PATH)
  },
  filename: function(req, file, cb) {
    console.log(file.originalname);
    var filename = file.originalname
    if (fs.existsSync(IMAGES_PATH+filename)){
      nameArr = filename.split('.')
      nameArr[0] += '-' + Date.now()
      filename = nameArr.join('.')
    }
    cb(null, filename)
  }
})
var imageUploader = multer({
  storage: imageStorage,
  limits: {
    fileSize: 50 * 1024 * 1024
  }
})

router.post('/images', imageUploader.single('image'), (req, res, next) => {
  var url = req.file.filename
  var original = IMAGES_PATH + url
  var thumb = THUMBS_PATH + url

  console.log('Generating thumb: ' + thumb)
  sharp(original)
    .resize(250)
    .toFile(thumb, function(err) {
      if (err) {
        console.log("File upload error: ", err)
      };
      res.status(201).send({
        url: original,
        thumb: thumb
      });
    });
});

var documentStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, DOCUMENTS_PATH)
  },
  filename: function(req, file, cb) {
    console.log(file.originalname);
    var filename = file.originalname
    if (fs.existsSync(DOCUMENTS_PATH+filename)){
      nameArr = filename.split('.')
      nameArr[0] += '-' + Date.now()
      filename = nameArr.join('.')
    }
    cb(null, filename)
  }
})
var documentUploader = multer({
  storage: documentStorage,
  limits: {
    fileSize: 50 * 1024 * 1024
  }
})
router.post('/documents', documentUploader.single('document'), (req, res, next) => {
  var url = req.file.filename
  console.log(req.file);
  res.status(201).send(DOCUMENTS_PATH + url);
});

module.exports = router;
