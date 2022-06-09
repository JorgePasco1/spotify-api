export const stringifyUris = (uris) =>
  '"' + JSON.stringify(uris).replace(/"/g, "'") + '"';

export const extractPlaylistIdFromTracksRequestUrl = (reqUrl) => reqUrl.split('/playlists/')[1].split('/')[0]
