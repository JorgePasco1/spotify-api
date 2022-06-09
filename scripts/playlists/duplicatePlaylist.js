import axios from 'axios';
import dotenv from 'dotenv';
import { ACCESS_TOKEN, USER_ID } from '../../constants.js';
dotenv.config();

import { extractPlaylistIdFromTracksRequestUrl, stringifyUris } from '../helper/stringHelper.js';

const duplicatePlaylist = async (playlistId, name) => {
  try {
    const getEndpoint = `https://api.spotify.com/v1/playlists/${playlistId}`;
    const getResponse = await axios.get(getEndpoint, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });
    const playlistData = getResponse.data;
    const {
      description,
      name: existingPlaylistName,
      tracks: { items },
    } = playlistData;

    const itemUris = items.map((item) => item.track.uri);

    const createEndpoint = `https://api.spotify.com/v1/users/${USER_ID}/playlists`;
    const createResponse = await axios.post(
      createEndpoint,
      {
        name: name || `${name || existingPlaylistName} (copy)`,
        description,
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );
    const newPlaylistId = createResponse.data.id;

    const insertEndpoint = `https://api.spotify.com/v1/playlists/${newPlaylistId}/tracks`;
    await axios.post(
      insertEndpoint,
      {
        uris: itemUris,
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );

    console.log(`🎉 Playlist ${name || existingPlaylistName} duplicated!. Link to new playlist: https://open.spotify.com/playlist/${newPlaylistId}`);
  } catch (e) {
    if (e.response.status === 404) {
      const dataSent = JSON.parse(e.config.data);
      const reqUrl = e.config.url;
      const playlistId = extractPlaylistIdFromTracksRequestUrl(reqUrl);
      const { uris } = dataSent;
      console.log("❌ The API didn't create the playlist on time in order to add the items. Use the addItems script.");
      console.log("ℹ️  Use this playlist id to add the items:", playlistId);
      console.log("ℹ️  Use the exact string (including quotes) as the second argument to the addItems script if needed:")
      console.log(stringifyUris(uris));
      return;
    }
    console.log('🚨 error');
    console.log(e);
  }
};

duplicatePlaylist(
  process.argv[2],
  process.argv.length > 3 ? process.argv[3] : null
);
