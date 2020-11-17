const express = require('express');
const router = express.Router();
const ClientOAuth2 = require('client-oauth2');
const fetch = require('node-fetch');

const discordauth = new ClientOAuth2({
  clientId: process.env.CLIENTID,
  clientSecret: process.env.CLIENTSECRET,
  accessTokenUri: 'https://discord.com/api/oauth2/token',
  authorizationUri: 'https://discord.com/api/oauth2/authorize',
  redirectUri: 'http://localhost:3000/auth/discord/callback',
  scopes: ['identify']
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('signin', { title: 'Auth Endpoint', login: '/auth/discord' });
});

router.get('/discord', function(req, res) {
  if (!req.session.dkey) {
    res.redirect(discordauth.code.getUri());
  } else return res.redirect('/api/user');
});

router.get('/discord/callback', async (req, res) => {
  if (!req.session.dkey) {
    const auth = await discordauth.code.getToken(req.originalUrl).catch(() => res.send({error: 'callback code is missing!'}));
    req.session.dkey = auth.data.access_token;
    req.session.cookie.expires = auth.expires;

    if (req.session.dkey && !req.session.user) {
      await fetch('https://discord.com/api/v6/users/@me', {
        headers: { 'Authorization': `Bearer ${req.session.dkey}` },
      })
        .then(res => res.json())
        .then(json => {
          req.session.user = {
            id: json.id,
            username: json.username,
            avatar_hash: json.avatar,
            locale: json.locale
          };
        });
      return res.redirect('/api/user');
    } else if (req.session.dkey && req.session.user) {
      return res.redirect('/api/user');
    } else {
      return res.send({error: 'access token was not set!'});
    }
  } else return res.redirect('/api/user');
});

module.exports = router;