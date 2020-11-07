const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'OAuth Discord Login', url: '/api/discord/login' });
});

module.exports = router;
