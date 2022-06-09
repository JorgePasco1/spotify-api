import axios from 'axios';
import dotenv from 'dotenv';
import { ACCESS_TOKEN } from '../../constants.js';
dotenv.config();

const insertItems = async (playlistId, items) => {
  const endpoint = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  await axios.post(
    endpoint,
    {
      uris: JSON.parse(items.replace(/'/g, '"')),
    },
    {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    }
  );
};

insertItems(process.argv[2], process.argv[3]);
