require("dotenv").config();
var keys = require("./keys")
var request = require("request")
var Spotify = require("node-spotify-api")
var dateFormat = require("dateFormat")
var fs = require("fs")

// Takes an artist and searches the Bands in Town 
// BandsinTown API for an artist and render information
let concertInfo= function(artist){
    let region = ""
    let queryUrl = "https://rest.bandsintown.com/artists/" + artist.replace(" ", "+") + "/events?app_id=codingbootcamp"
    
    request(queryUrl, function(err, response, body){
        if (!err && response.statusCode === 200) {
            let concertData = JSON.parse(body)
            
            outputData(artist + " concert information:")

            for (i=0; i < concertData.length; i++) {
                
                region = concertData[i].venue.region
                if (region === "") {
                    region = concertData[i].venue.country
                }

                // Need to return Name of venue, Venue location, Date of event (MM/DD/YYYY)
                outputData("Venue: " + concertData[i].venue.name)
                outputData("Location: " + concertData[i].venue.city + ", " + region);
                outputData("Date: " + dateFormat(concertData[i].datetime, "mm/dd/yyyy"))
            }
        }
    })
}

// This will take a song, search spotify and return information. Default song Buddy Holly 
let spotifySongInfo = function(song){
    if (!song){
        song = "Buddy Holly"
    }

    let spotify = new Spotify(keys.spotify);

    spotify.search({type: "track", query: song, limit: 1}, function (err, data){
        if (err) {
            return console.log(err)
        }
        let songInfo = data.tracks.items[0]
        outputData(songInfo.artists[0].name)
        outputData(songInfo.name)
        outputData(songInfo.album.name)
        outputData(songInfo.preview_url)
    })
}

// This will take a movie, search IMDb and return information. Defaut Tag.
let movieSelection = function(movie){
    if (!movie){
        movie = "Tag"
    }

    let queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
 
    request(queryUrl, function(err, response, body){
        // If the request is successful then...
        if (!err && response.statusCode === 200) {
            // Need to return: Title, Year, IMDB Rating, Rotten Tomatoes Rating, Country, 
            // Language, Plot, Actors
            let movieInfo = JSON.parse(body)

            outputData("Title: " + movieInfo.Title)
            outputData("Release year: " + movieInfo.Year)
            outputData("IMDB Rating: " + movieInfo.imdbRating)
            outputData("Rotten Tomatoes Rating: " + movieInfo.Ratings[1].Value)
            outputData("Country: " + movieInfo.Country)
            outputData("Language: " + movieInfo.Language)
            outputData("Plot: " + movieInfo.Plot)
            outputData("Actors: " + movieInfo.Actors)
        }
    })
}

// Using the `fs` Node package, LIRI will take the text inside of random.txt
// and then use it to call one of LIRI's commands.
let userAction = function(){
    fs.readFile("random.txt", "utf8", function (err, data) {
        if(err){
            return console.log(err)
        }
        
        let dataArr = data.split(",")
        runAction(dataArr[0], dataArr[1])
    });
}

// This function will handle outputting to the console and writing to log file
let outputData = function(data) {
    console.log(data)

    fs.appendFile("log.txt", "\r\n" + data, function (err){
        if(err){
            return console.log(err)
        } 
    })
}

let runAction = function(func, parm) {
    switch (func) {
        case "concert-Info":
         concertInfo(parm)
            break
        case "spotify-this-song":
         spotifySongInfo(parm)
            break
        case "movie-Selection":
         movieSelection(parm)
            break
        case "user-Action":
         userAction()
            break
        default:
         outputData("That is not a command that I recognize, please try again.") 
    }
}

runAction(process.argv[2], process.argv[3])
