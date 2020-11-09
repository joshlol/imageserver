const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

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

module.exports = router;