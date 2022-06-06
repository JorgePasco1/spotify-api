import axios from 'axios';
import dotenv from 'dotenv';
import { ACCESS_TOKEN } from './constants.js';
dotenv.config();

const shuffle = (array) => {
  const getRandomPos = (idx) => Math.floor(Math.random() * (idx + 1)); // random index from 0 to i

  const result = [...array];
  for (let idx = array.length - 1; idx > 0; idx--) {
    const newPos = getRandomPos(idx);
    [result[idx], result[newPos]] = [result[newPos], result[idx]];
  }
  return result;
};

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
    console.log('before shuffle snapshot id', deleteResponse.data);

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
    console.log('after shuffle snapshot id', putResponse.data);
  } catch (e) {
    console.log('🚨 error');
    console.log(e);
  }
};

executeShuffle(process.argv[2]);
