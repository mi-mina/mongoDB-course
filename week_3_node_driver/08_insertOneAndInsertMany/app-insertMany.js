var MongoClient = require('mongodb').MongoClient,
    Twitter = require('twitter'),
    assert = require('assert');

require('dotenv').load(); //No need to store it in a var

var client = new Twitter({  // The twitter client
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});


MongoClient.connect('mongodb://localhost:27017/social', function(err, db) {

    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");

    var screenNames = ["Marvel", "DCComics", "TheRealStanLee"];
    var done = 0;

    screenNames.forEach(function(name) {

        var cursor = db.collection("statuses").find({"user.screen_name": name});
        cursor.sort({ "id": -1 });
        cursor.limit(1);

        // The cursor finds the last document inserted for a specific twitter user.

        cursor.toArray(function(err, docs) { //We turn the cursor into an array
            assert.equal(err, null);

            var params;

            if (docs.length == 1) {
                params = { "screen_name": name, "since_id": docs[0].id, "count": 10 };
                // If docs.lenght == 1, it means that we already have some tweets
                // for this user, and we don't want to add tweets that we already added.
                // So we specify the 'since_id' param.
                // The count param specifies the number of tweets to try and retrieve
            } else {
                params = { "screen_name": name, "count": 10 };
            }

            // GET statuses/user_timeline endpoint
            // client.get(path, params, callback);
            client.get('statuses/user_timeline', params, function(err, statuses, response) {

                assert.equal(err, null);

                db.collection("statuses").insertMany(statuses, function(err, res) {
                  // insertMany expects to receive an array of documents and a callback function
                  // insertMany(docs, options, callback)

                    console.log(res);

                    done += 1;
                    if (done == screenNames.length) {
                        db.close();
                    }

                });
            });
        })
    });
});
