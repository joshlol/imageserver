const express = require('express');
const router = express.Router();
const ClientOAuth2 = require('client-oauth2');

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
  res.render('signin', { title: 'API, handling image upload & login', login: '/auth/discord' });
});

router.get('/discord', function(req, res) {
  if (!req.cookies.get('akey')) {
    res.redirect(discordauth.code.getUri());
  } else return res.redirect('/api/user');
});

router.get('/discord/callback', async (req, res) => {
  if (!req.cookies.get('akey')) {
    const auth = await discordauth.code.getToken(req.originalUrl).catch(() => res.send({error: 'callback code is missing!'}));
    await res.cookies.set('akey', auth.data.access_token, {'expires': auth.expires, signed: true});
    return res.redirect('/api/user');
  } else return res.redirect('/api/user');
});

module.exports = router;