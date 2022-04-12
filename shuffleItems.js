import axios from 'axios';
import dotenv from 'dotenv';
import { ACCESS_TOKEN } from './constants.js';
dotenv.config()

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

const executeShuffle = async (playlistId) => {
  try {
    const endpoint = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    const getResponse = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });
    const track_uris = getResponse.data.items.map((item) => item.track.uri);
    const shuffled_uris = shuffle(track_uris);
    const shuffled_uri_objects = shuffled_uris.map((uri) => ({ uri }));

    const deleteResponse = await axios.delete(endpoint, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      data: {
        tracks: shuffled_uri_objects,
      },
    });
    console.log('before deletion snapshot id', deleteResponse.data);

    const putResponse = await axios({
      method: 'put',
      url: endpoint,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      data: {
        uris: shuffled_uris,
      },
    });
    console.log('after deletion snapshot id', putResponse.data);
  } catch (e) {
    console.log('error');
    console.log(e);
  }
};

executeShuffle(process.argv[0]);
