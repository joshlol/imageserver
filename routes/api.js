const express = require('express');
const router = express.Router();
const upload = require('../handlers/upload.js');
const rename = require('../handlers/rename.js');
const path = require('path');

router.get('/user', async (req, res) => {
  if (req.session.user) {
    res.send(req.session.user);
  } else {
    res.send({error: 'userdata object was missing!'});
  }

});

router.post('/upload', upload.single('photo'), async (req, res) => {
  const imagePath = path.join('./uploads');
  const fileUpload = new rename(imagePath);
  if (!req.file) return res.status(401).json({error: 'Please provide an image'});
  const filename = await fileUpload.save(req.file.buffer);
  return res.status(200).send(filename);
});

module.exports = router;