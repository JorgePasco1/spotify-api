# Spotify API

Server/scripts to execute actions through the Spotify API. Create an `.env` file with the variables in `.env.example`.

## Instructions

1. Install dependencies:

```sh
npm install
```

2. Add env variables:

To start, we don't need the `ACCESS_TOKEN`, we will be getting that later. The user id is the handle for your spotify user (can get by sharing the profile)

3. Run the server:

```sh
npm start
```

By default it will run on port `8888`

4. Hit the `/login` endpoint to get a token`
5. Replace the `ACCESS_TOKEN` variable in the `.env` file with the new token.
6. Run one of the available scripts. For example:

```sh
node ./scripts/playlists/shuffleItems.js <playListId>
```

## Available Scripts

### Playlists

- `shuffleItems.js`: Shuffles the order of the tracks in a playlist.
- `addItems.js`: Adds a list of tracks to a playlist.
- `getPlaylistItems`: Query the list of tracks in a playlist.
- `duplicatePlaylist`: Create a duplicate of an existent playlist.
