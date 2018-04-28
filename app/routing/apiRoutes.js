var friends = require("../data/friends");
var path = require("path");

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {

  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------

  app.get("/api/friends", function(req, res) {
    res.json(friends);
  });


  // API POST Requests

  app.post("/api/friends", function(req, res) {

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

};