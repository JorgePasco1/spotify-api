import axios from 'axios';
import dotenv from 'dotenv';
import ora from 'ora';

dotenv.config();

import { ACCESS_TOKEN, USER_ID } from '../../constants.js';
import {
  extractPlaylistIdFromTracksRequestUrl,
  stringifyUris,
} from '../helper/stringHelper.js';
import { sleep } from '../helper/timeHelper.js';

const getPlaylistData = async (playlistId) => {
  const getEndpoint = `https://api.spotify.com/v1/playlists/${playlistId}`;
  try {
    const getResponse = await axios.get(getEndpoint, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });
    return getResponse;
  } catch (e) {
    if (e.response.status === 401)
      return console.log('⏰ You need to generate a new token.');
    console.log('🚨 Error getting the playlist data.');
    return console.log(e);
  }
};

const createPlaylist = async (name, description) => {
  const createEndpoint = `https://api.spotify.com/v1/users/${USER_ID}/playlists`;
  try {
    const createResponse = await axios.post(
      createEndpoint,
      {
        name,
        description,
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );
    return createResponse;
  } catch (e) {
    if (e.response.status === 401)
      return console.log('⏰ Token expired. You need to generate a new one.');
    console.log('🚨 Error creating the playlist.');
    return console.log(e);
  }
};

const populateList = async (playlistId, itemUris) => {
  try {
    const insertEndpoint = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
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
  } catch (e) {
    if ([404, 500].includes(e.response.status)) {
      const dataSent = JSON.parse(e.config.data);
      const reqUrl = e.config.url;
      const playlistId = extractPlaylistIdFromTracksRequestUrl(reqUrl);
      const { uris } = dataSent;
      console.log('Status response:', e.response.status);
      console.log(
        "❌ The API didn't create the playlist on time in order to add the items. Use the addItems script."
      );
      console.log('ℹ️  Use this playlist id to add the items:', playlistId);
      console.log(
        'ℹ️  Use the exact string (including quotes) as the second argument to the addItems script if needed:'
      );
      console.log(stringifyUris(uris));
      return;
    }
    console.log('🚨 error');
    console.log(e);
  }
};

const duplicatePlaylist = async (playlistId, name) => {
  // Get Data
  const getResponse = await getPlaylistData(playlistId);
  if (!getResponse) return;
  const playlistData = getResponse.data;
  const {
    description,
    name: existingPlaylistName,
    tracks: { items },
  } = playlistData;

  const itemUris = items.map((item) => item.track.uri);

  // Create new playlist
  const newPlaylistName = name || `${name || existingPlaylistName} (copy)`;
  const createResponse = await createPlaylist(newPlaylistName, description);
  if (!createResponse) return;

  const newPlaylistId = createResponse.data.id;

  const spinner = ora(
    'Awaiting for a bit before inserting playlist items.'
  ).start();
  await sleep(5000);
  spinner.stop();

  // Populate new playlist
  await populateList(newPlaylistId, itemUris);

  console.log(
    `🎉 Playlist ${existingPlaylistName} duplicated!. Link to new playlist: https://open.spotify.com/playlist/${newPlaylistId}`
  );
};

duplicatePlaylist(
  process.argv[2],
  process.argv.length > 3 ? process.argv[3] : null
);
