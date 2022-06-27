// dotenv package makes private the clientID and clientSecret on Github
require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const { reset } = require('nodemon');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  // Retrieve an access token
    spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

    // Our routes go here:
app.get("/", (req, res) => {
    res.render("index")
})

app.get("/artist-search", (req, res) => {
    spotifyApi
    .searchArtists(req.query.q)
    .then(data => {
      // console.log('The received data from the API: ', data.body.artists.items);
      res.render('artist-search-results', { artistsList: data.body.artists.items})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})
    
app.get("/albums/:artistId", (req, res, next) => {
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
        // console.log('The albums of the searched artist: ', data.body.items);
        res.render('albums', { albumList: data.body.items})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/tracks/:albumId", (req, res, next) => {
    spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data => {
        // console.log('The albums of the selected album: ', data.body.items);
        res.render('tracks', { tracksList: data.body.items})
    })
        .catch(err => console.log('The error while searching tracks occurred: ', err));
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
