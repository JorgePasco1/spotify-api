import querystring from 'querystring';
import express from 'express';
import axios from 'axios';

import { CLIENT_ID, CLIENT_SECRET } from './constants.js';

const REDIRECT_URI = 'http://localhost:8888/callback';

var app = express();

const generateRandomString = (length = 8) => {
  // Declare all characters
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  // Pick characers randomly
  let str = '';
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return str;
};

app.get('/login', function (req, res) {
  var state = generateRandomString(16);
  var scope =
    'user-read-private user-read-email playlist-modify-public playlist-modify-private';

  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: REDIRECT_URI,
        state: state,
      })
  );
});

app.get('/callback', (req, res) => {
  var code = req.query.code || null;
  var state = req.query.state || null;

  if (state === null) {
    res.redirect(
      '/#' +
        querystring.stringify({
          error: 'state_mismatch',
        })
    );
  } else {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', REDIRECT_URI);

    axios
      .post('https://accounts.spotify.com/api/token', params, {
        headers: {
          Authorization:
            'Basic ' +
            new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((response) => {
        console.log(response.data);
      });
  }

  res.send({ code, state });
});

app.listen(8888, () => {
  console.log('Listening on port 8888');
});
