require("dotenv").config();
var keys = require("./keys")
var request = require("request")
var Spotify = require("node-spotify-api")
var dateFormat = require("dateFormat")
var fs = require("fs")

// Takes an artist and searches the Bands in Town 
// Artist API for an artist and render information
let concertInfo= function(artist){
    let region = ""
    let queryUrl = "https://rest.bandsintown.com/artists/" + artist.replace(" ", "+") + "/events?app_id=codingbootcamp"
    //console.log(queryUrl);
    
    request(queryUrl, function(err, response, body){
        // If the request is successful
        if (!err && response.statusCode === 200) {
            // Save parsed body in a new variable for easier use
            let concertData = JSON.parse(body)
            
            console.log(artist + " concert information:")

            for (i=0; i < concertInfo.length; i++) {
                
                region = concertData[i].venue.region
                if (region === "") {
                    region = concertInfo[i].venue.country
                }

                // Need to return Name of venue, Venue location, Date of event (MM/DD/YYYY)
                console.log("Venue: " + concertInfo[i].venue.name)
                cconsole.log("Location: " + concertInfo[i].venue.city + ", " + region);
                cconsole.log("Date: " + dateFormat(concertInfo[i].datetime, "mm/dd/yyyy"))
            }
        }
    })
}

// This will take a song, search spotify and return information
let spotifyThisSong = function(song){
    // Default should be "The Sign" by Ace of Base
    if (!song){
        song = ""
    }

    let spotify = new Spotify(keys.spotify);

    spotify.search({type: "track", query: song, limit: 1}, function (err, data){
        if (err) {
            return console.log(err)
        }

        // Need to return Artist(s), Song Name, Album, Preview link of song from Spotify
        let songInfo = data.tracks.items[0]
        console.log(songInfo.artists[0].name)
        console.log(songInfo.name)
        console.log(songInfo.album.name)
        console.log(songInfo.preview_url)
    })
}

// This will take a movie, search IMDb and return information
let movieSelection = function(movie){
    // Default should be "Mr. Nobody"
    if (!movie){
        movie = "Mr.+Nobody"
    }

    let queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    //console.log(queryUrl);

    // Then create a request to the queryUrl
    request(queryUrl, function(err, response, body){
        // If the request is successful
        if (!err && response.statusCode === 200) {
            // Need to return: Title, Year, IMDB Rating, Rotten Tomatoes Rating, Country, 
            // Language, Plot, Actors
            let movieInfo = JSON.parse(body)

            console.log("Title: " + movieInfo.Title)
            console.log("Release year: " + movieInfo.Year)
            console.log("IMDB Rating: " + movieInfo.imdbRating)
            console.log("Rotten Tomatoes Rating: " + movieInfo.Ratings[1].Value)
            console.log("Language: " + movieInfo.Language)
            console.log("Plot: " + movieInfo.Plot)
            console.log("Actors: " + movieInfo.Actors)
        }
    })
}

// Using the `fs` Node package, LIRI will take the text inside of random.txt
// and then use it to call one of LIRI's commands.
let userAction = function(){

    // read from file
    fs.readFile("random.txt", "utf8", function (err, data) {
        if(err){
            return console.log(err)
        }
        
        let dataArr = data.split(",")

        // call appropriate function and pass arguement
        runAction(dataArr[0], dataArr[1])
    });
}

// This function will handle outputting to the console and writing to log file
//let outputData = function(data) {
//     console.log(data)

//     fs.appendFile("log.txt", "\r\n" + data, function (err){
//         if(err){
//             return console.log(err)
//         } 
//     })
// }

let runAction = function(func, parm) {
    switch (func) {
        case "concert-this":
            concertThis(parm)
            break
        case "spotify-this-song":
            spotifyThisSong(parm)
            break
        case "movie-this":
            movieThis(parm)
            break
        case "user-Action":
            userAction()
            break
        default:
            aler("That is not a command that I recognize, please try again.") 
    }
}

runAction(process.argv[2], process.argv[3])