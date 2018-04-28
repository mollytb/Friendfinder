//required modules
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

//var htmlRoutes = require("./app/routing/htmlRoutes")(app);
//var apiRoutes = require("./app/routinh/apiRoutes")(app);
//Users/Molly/Desktop/FriendFinder/routing/htmlRoutes.js
// Sets up the Express App
var app = express();
//use port 3000

var PORT = 8080;

// Sets up the Express app to handle data parsing
//boiler plate stuff
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(bodyParser.text());
app.use(bodyParser.json({
    type: "application/vnd.api+json"
}));



//app.use(apiRoutes());
//app.use(htmlRoutes());

app.get("/", function (req, res) {
    // restaurant info
    res.sendFile(path.join(__dirname, "app/public/home.html"));
});
app.get("/survey", function (req, res) {
    // restaurant info
    res.sendFile(path.join(__dirname, "app/public/survey.html"));
});
app.get("/api/friends", function (req, res) {
    res.json(friends);
});


// API POST Requests

app.post("/api/friends", function (req, res) {

    // After the survey, it will push the user to the database.

    var bestMatch = {
        name: "",
        photo: "",
        friendDifference: 1000
    };

    // Take the result of the user's survey POST and parse it.
    var userData = req.body;
    var userScores = userData.scores;

    // Calculate the difference between the user's scores and others

    var totalDifference = 0;

    // Loop through all the friend possibilities in the database.
    for (var i = 0; i < friends.length; i++) {

        console.log(friends[i].name);
        totalDifference = 0;

        // Then loop through all the scores of each friend
        for (var j = 0; j < friends[i].scores[j]; j++) {

            // Calculate the difference between the scores and sum them into the totalDifference
            totalDifference += Math.abs(parseInt(userScores[j]) - parseInt(friends[i].scores[j]));

            // If the sum of differences is less then the differences of the current "best match"
            if (totalDifference <= bestMatch.friendDifference) {

                // Reset the bestMatch to be the new friend.
                bestMatch.name = friends[i].name;
                bestMatch.photo = friends[i].photo;
                bestMatch.friendDifference = totalDifference;
            }
        }
    }

    // Save the user's data to the database (this has to happen AFTER the check. otherwise,
    // the database will always return that the user is the user's best friend).
    friends.push(userData);

    // Return a JSON with the user's bestMatch. This will be used by the HTML in the next page
    res.json(bestMatch);
});




app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});