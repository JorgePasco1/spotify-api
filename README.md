# Spotify API

Server/scripts to execute actions through the Spotify API. Create an `.env` file with the variables in `.env.example`.

## Instructions

1. Install dependencies:

```sh
npm install
```

2. Run the server:

```sh
npm start
```

By default it will run on port `8888`

3. Hit the `/login` endpoint to get a token`
4. Replace the `ACCESS_TOKEN` variable in the `.env` file with the new token.
5. Run one of the available scripts. For example:

```sh
node shuffleItems.js <playListId>
```

## Available Scripts

- `shuffleItems.js`: Shuffles the items in a playlist.
