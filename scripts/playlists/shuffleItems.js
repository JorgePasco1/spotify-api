import axios from 'axios';
import dotenv from 'dotenv';
import { ACCESS_TOKEN } from '../../constants.js';
dotenv.config();

import { stringifyUris } from '../helper/stringHelper.js';

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
    const trackUris = getResponse.data.items.map((item) => item.track.uri);
    const shuffledUris = shuffle(trackUris);
    console.log('Backup track uris:', stringifyUris(shuffledUris));
    console.log(
      'ℹ️  Use the exact string (including quotes) as the second argument to the addItems script if needed.'
    );
    const shuffledUriObjects = shuffledUris.map((uri) => ({ uri }));

    await axios.delete(endpoint, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      data: {
        tracks: shuffledUriObjects,
      },
    });

    await axios.post(
      endpoint,
      {
        uris: shuffledUris,
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );
    console.log('Success 🎉');
  } catch (e) {
    console.log('🚨 error');
    console.log(e);
  }
};

executeShuffle(process.argv[2]);
