const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const ClientOAuth2 = require('client-oauth2');

const discordauth = new ClientOAuth2({
  clientId: process.env.CLIENTID,
  clientSecret: process.env.CLIENTSECRET,
  accessTokenUri: 'https://discord.com/api/oauth2/token',
  authorizationUri: 'https://discord.com/api/oauth2/authorize',
  redirectUri: 'http://localhost:3000/api/login/discord/callback',
  scopes: ['identify']
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('signin', { title: 'API, handling image upload & login', url: '/api/login/discord' });
});

router.get('/login/discord', function(req, res) {
  res.redirect(discordauth.code.getUri());
});

router.get('/login/discord/callback', async (req, res) => {
  discordauth.code.getToken(req.originalUrl).then(function(user) {
    res.cookies.set('akey', user.data.access_token, {'expires': user.expires, signed: true});
    return res.redirect('/api/user');
  });
});

router.get('/user', async (req, res) => {
  const key = req.cookies.get('akey');
  if (key) {
    fetch('https://discord.com/api/v6/users/@me', {
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