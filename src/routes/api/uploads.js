var express = require('express'),
  router = express.Router(),
  multer = require('multer'),
  fs = require('fs'),
  sharp = require('sharp');

const UPLOAD_PATH = 'uploads/';
const IMAGES_PATH = UPLOAD_PATH + 'images/';
const THUMBS_PATH = UPLOAD_PATH + 'thumbs/';
const DOCUMENTS_PATH = UPLOAD_PATH + 'documents/';
const AUDIOS_PATH = UPLOAD_PATH + 'audios/';
!fs.existsSync(UPLOAD_PATH) && fs.mkdirSync(UPLOAD_PATH);
!fs.existsSync(IMAGES_PATH) && fs.mkdirSync(IMAGES_PATH);
!fs.existsSync(THUMBS_PATH) && fs.mkdirSync(THUMBS_PATH);
!fs.existsSync(DOCUMENTS_PATH) && fs.mkdirSync(DOCUMENTS_PATH);
!fs.existsSync(AUDIOS_PATH) && fs.mkdirSync(AUDIOS_PATH);

var imageStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, IMAGES_PATH)
  },
  filename: function(req, file, cb) {
    var filename = file.originalname
    if (fs.existsSync(IMAGES_PATH+filename)){
      var nameArr = filename.split('.')
      nameArr[0] += '-' + Date.now()
      filename = nameArr.join('.')
    }
    cb(null, filename)
  }
})
var imageUploader = multer({
  storage: imageStorage,
  limits: {
    fileSize: 32 * 1024 * 1024
  }
})

router.post('/images', imageUploader.single('image'), (req, res) => {
  var url = req.file.filename
  var original = IMAGES_PATH + url
  var thumb = THUMBS_PATH + url

  sharp(original)
    .resize(250)
    .toFile(thumb, function(err) {
      if (!err) {
        res.status(201).send({
          url: original,
          thumb: thumb
        });
      }
    });
});

var documentStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, DOCUMENTS_PATH)
  },
  filename: function(req, file, cb) {
    var filename = file.originalname
    if (fs.existsSync(DOCUMENTS_PATH+filename)){
      var nameArr = filename.split('.')
      nameArr[0] += '-' + Date.now()
      filename = nameArr.join('.')
    }
    cb(null, filename)
  }
})
var documentUploader = multer({
  storage: documentStorage,
  limits: {
    fileSize: 32 * 1024 * 1024
  }
})
router.post('/documents', documentUploader.single('document'), (req, res) => {
  var url = req.file.filename
  res.status(201).send(DOCUMENTS_PATH + url);
});

var audioStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, AUDIOS_PATH)
  },
  filename: function(req, file, cb) {
    var filename = file.originalname
    if (fs.existsSync(AUDIOS_PATH+filename)){
      var nameArr = filename.split('.')
      nameArr[0] += '-' + Date.now()
      filename = nameArr.join('.')
    }
    cb(null, filename)
  }
})
var audioUploader = multer({
  storage: audioStorage,
  limits: {
    fileSize: 32 * 1024 * 1024
  }
})
router.post('/audios', audioUploader.single('audio'), (req, res) => {
  var url = req.file.filename
  res.status(201).send(AUDIOS_PATH + url);
});

module.exports = router;
