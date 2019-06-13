var express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    fs = require('fs'),
    sharp = require('sharp');

const UPLOAD_PATH = 'uploads/'
const IMAGES_PATH = UPLOAD_PATH+'images/'
const THUMBS_PATH = UPLOAD_PATH+'thumbs/'
!fs.existsSync(UPLOAD_PATH) && fs.mkdirSync(UPLOAD_PATH);
!fs.existsSync(IMAGES_PATH) && fs.mkdirSync(IMAGES_PATH);
!fs.existsSync(THUMBS_PATH) && fs.mkdirSync(THUMBS_PATH);

// Multer Settings for file upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, IMAGES_PATH)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+'.'+ file.originalname.split('.').pop())
    }
})

var upload = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024 } })

// Upload a new image with description
router.post('/images', upload.single('image'), (req, res, next) => {
  var url = req.file.filename
  var original = IMAGES_PATH+url
  var thumb = THUMBS_PATH+url

  console.log('Generating thumb: '+thumb)
  sharp(original)
  .resize(250)
  .toFile(thumb, function(err) {
    if (err) { console.log("File upload error: ",err) };
    res.status(201).send({ url: original, thumb: thumb});
  });

});

module.exports = router;
