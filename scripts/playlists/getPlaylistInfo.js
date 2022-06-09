import axios from 'axios';
import dotenv from 'dotenv';
import { ACCESS_TOKEN } from '../../constants.js';
dotenv.config();

const getPlaylistInfo = async (playlistId) => {
  try {
    const endpoint = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    const getResponse = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });
    const track_uris = getResponse.data.items.map((item) => item.track.uri);

    console.log(track_uris);

  } catch (e) {
    console.log('🚨 error');
    console.log(e);
  }
};

getPlaylistInfo(process.argv[2]);
