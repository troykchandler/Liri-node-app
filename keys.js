var Spotify = require('node-spotify-api');
 
var spotify = new Spotify({
  id: process.env.Spotify_ID,
  secret: process.env.SPOTIFY_SECRET
});
