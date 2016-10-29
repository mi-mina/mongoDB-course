var MongoClient = require('mongodb').MongoClient, //Reference to the driver
    assert = require('assert');


MongoClient.connect('mongodb://localhost:27017/crunchbase', function(err, db) {
  // connection: name:port/database
  // When we start a connection to mongoDB the default port is 27017
  // If we wnat to connect to mongoDB running on a different host (on other machine),
  // we would need to change localhost to the name or IP address of that host.

    assert.equal(err, null);
    console.log("Successfully connected to MongoDB.");

    var query = {"category_code": "web"};

    db.collection('companies').find(query).toArray(function(err, docs) {
      // The toArray method will comsume the cursor and return an array (docs)

        assert.equal(err, null);
        assert.notEqual(docs.length, 0);
        // The doc's length of the result must be not equal to 0, to make sure
        // we get more than 0 documets back.

        docs.forEach(function(doc) {
          if (doc.founded_year &&  doc.founded_year < 1900) {
            console.log( doc.name + " is a " + doc.category_code + " company founded in " + doc.founded_year );
          }
        });

        db.close();

    });

});
