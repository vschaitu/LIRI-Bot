// import { twitter, spotify } from "./keys";

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

// Get input request type from CLI argument
var ipReqType = process.argv[2];

// Get input Additonal input from CLI arguments
var ipReqData = process.argv.slice(3).join(" ");

