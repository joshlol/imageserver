const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const upload = require('../handlers/upload.js');
const rename = require('../handlers/rename.js');
const path = require('path');

router.get('/user', async (req, res) => {
  const key = req.cookies.get('akey', { signed: true });
  if (key) {
    await fetch('https://discord.com/api/v6/users/@me', {
      headers: { 'Authorization': `Bearer ${key}` },
    })
      .then(res => res.json())
      .then(json => {
        res.send(json);
      });
  } else {
    res.send({error: 'callback cookie is missing! try reloging back in!'});
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