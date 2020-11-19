const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', async function(req, res) {
  const user = await req.session.user;
  if (!user) {
    res.redirect('/auth/');
  } else if (user) {
    res.render('index', { user: user });
  } else {
    res.send({error: 'could not get user object from session'});
  }
});

router.get('/upload', async function(req, res) {
  const user = await req.session.user;
  if (!user) {
    res.redirect('/auth/');
  } else if (user) {
    res.render('upload', { user: user });
  } else {
    res.send({error: 'could not get user object from session'});
  }
});

module.exports = router;
