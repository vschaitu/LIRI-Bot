// import { twitter, spotify } from "./keys";
// add fs pkg required for wirting logs
var fs = require("fs");

// add https npm request & object instance
var request = require('request');

// Add package required to import env details
require("dotenv").config();

// get keys from keys.js file
var keys = require("./keys");

// add twitter npm & object instance 
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);

// add spotify npm & object instance 
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

// add moment npm to get timestamp for logging
var moment = require('moment');

// Get input request type from CLI argument
var ipReqType = process.argv[2];

// Get input Additonal input from CLI arguments
var ipReqData = process.argv.slice(3).join(" ");

// log the input parameters
writelog('Request Type: ' + ipReqType + ' Request Addtn Data: ' + ipReqData);

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
        break;
    case 'do-what-it-says':
        break;
    default:
        console.log(moment().format());
        console.log('********Invalid request!!!*********');
}

// logging data to log.txt - add timestamp & data 
function writelog(data) {
    var logrec = '\n' + moment().format() + " " + data;
    fs.appendFile("log.txt", logrec, function (err) {
        if (err) throw err;
    });

}

// gets 20 tweets from twitter npm , displays on terminal & logs
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
                "Album: " + resp.album.name
            ].join("\n");
            console.log(showData);
        })
        .catch(function (err) {
            console.log(err);
        });
}