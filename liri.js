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
        getTweets();
        break;
    case 'spotify-this-song':
        break
    case 'movie-this':
        break;
    case 'do-what-it-says':
        break;
    default:
        console.log(moment().format());
        console.log('********Invalid request!!!*********');
}


function writelog(data) {
    var logrec = '\n' + moment().format() + " " + data;
    fs.appendFile("log.txt", logrec, function (err) {
        if (err) throw err;
    });

}

function getTweets() {
    client.get('search/tweets', { q: 'node.js' }, function (error, tweets, response) {
        console.log(tweets);
    });
}