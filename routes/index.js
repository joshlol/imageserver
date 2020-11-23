const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', async function(req, res) {
  const user = await req.session.user;
  if (user) {
    return res.render('index', { user: user });
  } else {
    return res.redirect('/auth/');
  }
});

router.get('/upload', async function(req, res) {
  const user = await req.session.user;
  if (user) {
    return res.render('upload', { user: user });
  } else {
    return res.redirect('/auth/');
  }
});

module.exports = router;
