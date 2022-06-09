import axios from 'axios';
import dotenv from 'dotenv';
import { ACCESS_TOKEN } from '../../constants.js';
dotenv.config();

const getPlaylistItems = async (playlistId) => {
  try {
    const endpoint = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    const getResponse = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });
    const trackUris = getResponse.data.items.map((item) => item.track.uri);

    console.log(trackUris);

  } catch (e) {
    console.log('🚨 error');
    console.log(e);
  }
};

getPlaylistItems(process.argv[2]);
