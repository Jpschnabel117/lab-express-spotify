require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});
// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );
// Our routes go here:
app.get("/", (req, res, next) => {
  res.render("index");
});
app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.Artist)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      let myArtistsArray = data.body.artists.items;
      res.render("artist-search-results", { myArtistsArray });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});
app.get("/albums/:artistId", (req, res, next) => {
  console.log(req.params);
  spotifyApi.getArtistAlbums(req.params.artistId).then((data) => {
    let albumlist = data.body.items;
    console.log(albumlist);
    res.render("albums", { albumlist });
  });
});
app.get("/tracklist/:albumId", (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId).then((data) => {
    console.log(data.body);
    let tracklist = data.body.items
     res.render("tracks", { tracklist });
  });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
