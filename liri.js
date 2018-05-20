// Add fs pkg required for wirting logs/read random.txt files
var fs = require("fs");

// Add https npm request & object instance
var request = require('request');

// Add package required to import env details
require("dotenv").config();

// Include/Import keys.js file
var keys = require("./keys");

// Add twitter npm & object instance 
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);

// Add spotify npm & object instance 
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

// Add moment npm to get timestamp for logging
var moment = require('moment');

// Get input request type from CLI argument
var ipReqType = process.argv[2];

// Get input Additonal input from CLI arguments
var ipReqData = process.argv.slice(3).join(" ");

// At start- log the input parameters received with timestamp 
writelog('Request Type: ' + ipReqType + ' Request Addtn Data: ' + ipReqData);

// Check input action code & call subsequent logic based on action code
switch (ipReqType) {
    case 'my-tweets':
        getMyTweets();
        break;
    case 'spotify-this-song':
        if (ipReqData == "") {
            ipReqData = "The Sign Ace of Base"
        };
        getSongInfo();
        break;
    case 'movie-this':
        if (ipReqData == "") {
            ipReqData = "Mr. Nobody"
        };
        getMovieInfo();
        break;
    case 'do-what-it-says':
        doWhatItSays();
        break;
    default:
        console.log('********Invalid request!!!*********');
}

// logging data to log.txt - add timestamp & data 
function writelog(data) {
    var logrec = '\n' + moment().format() + " " + data;
    fs.appendFile("log.txt", logrec, function (err) {
        if (err) throw err;
    });

}

// Gets 20 tweets from twitter npm , displays on terminal & logs
function getMyTweets() {
    client.get('statuses/user_timeline', { screen_name: '@shanghaidaily', count: 20 }, function (error, tweets, response) {
        if (!error) {
            // log the whole response from twitter 
            var resp = JSON.stringify(tweets);
            writelog(resp);
            // display the resuls on bash
            var showData;
            tweets.forEach(element => {
                showData = [
                    "******************",
                    "Tweet By: " + element.user.name,
                    "Tweet: " + element.text,
                    "Created at: " + element.created_at,
                    "Favourite Count: " + element.favorite_count
                ].join("\n");
                console.log(showData);
            });

        } else {
            throw error
        }
    });
}

// Gets the track information and displays on bash & logs the response to .txt
function getSongInfo() {
    spotify.search({ type: 'track', query: ipReqData })
        .then(function (response) {
            // log the whole response from twitter 
            var resp = JSON.stringify(response);
            writelog(resp);
            // display the first search returned item onto bash
            var resp = response.tracks.items[0];
            var artists = [];
            resp.artists.forEach(element => {
                artists.push(element.name)
            });
            var showData = [
                "*******************",
                "Track: " + resp.name,
                "Artist(s): " + artists.join(', '),
                "Preview link: " + resp.preview_url,
                "Album: " + resp.album.name,
                "*******************"
            ].join("\n");
            console.log(showData);
        })
        .catch(function (err) {
            console.log(err);
        });
}

// Gets movie info from OMDB hhtps request
function getMovieInfo() {
    var URL = "http://www.omdbapi.com/?t=" + ipReqData + "&y=&plot=short&apikey=trilogy";
    request(URL, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            // log the whole response from twitter 
            writelog(JSON.stringify(body));
            // display the movie info onto Bash
            var resp = JSON.parse(body);
            var rotRating = "";
            resp.Ratings.forEach(element => {
                if (element.Source == "Rotten Tomatoes") {
                    rotRating = element.Value;
                }
            });
            var showData = [
                "*******************",
                "Movie Title: " + resp.Title,
                "Year: " + resp.Year,
                "Director: " + resp.Director,
                "IMDB Rating: " + resp.imdbRating,
                "Rotten Tomatoes Rating: " + rotRating,
                "Country of Origin: " + resp.Country,
                "Language: " + resp.Language,
                "Plot: " + resp.Plot,
                "Actors: " + resp.Actors,
                "*******************",
            ].join("\n");
            console.log(showData);
        }
    });

};

// Reads the random txt and gets arguments and performs spoity search on track
function doWhatItSays() {
    //read the random.txt
    fs.readFile("random.txt", "utf8", function (error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }
        // split it by commas and fetch arguments
        var dataArr = data.split(",");
        ipReqData = dataArr[1];
        // call spotify search
        getSongInfo();
    });
}