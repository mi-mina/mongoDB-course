// Strategy for cleaning up the databse
// There are some duplicated records. If two documents have the same permalink and were
// updated at the same time, we can assume that they are duplicated.
// We do a query and sort it, and those that are identical should ocurr in sequence

var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


MongoClient.connect('mongodb://localhost:27017/crunchbase', function(err, db) {

    assert.equal(err, null);
    console.log("Successfully connected to MongoDB.");

    var query = {"permalink": {"$exists": true, "$ne": null}};
    var projection = {"permalink": 1, "updated_at": 1};

    var cursor = db.collection('companies').find(query);
    cursor.project(projection);
    cursor.sort({"permalink": 1})

    // We can sort on the database side, within mongoDB itself, provided that we
    // have set up an index that mongoDB can use to do our sort. In this case would
    // be an index on permalink. If we don't have such an index set up, what it
    // happens is that the system is going to try to do a sort in memory, rather
    // than in the database

    var numToRemove = 0;

    var previous = { "permalink": "", "updated_at": "" };
    cursor.forEach(
      // deleteOne is unefficient for deleting a big number of documents
      // We are looping more than 900 times in this example.
      // deleteOne is fine for deleting one or two documents.
        function(doc) {

            if ( (doc.permalink == previous.permalink) && (doc.updated_at == previous.updated_at) ) {
                console.log(doc.permalink);

                numToRemove = numToRemove + 1;

                var filter = {"_id": doc._id};

               db.collection('companies').deleteOne(filter, function(err, res) {
                // deleteOne takes a filter wich is basically a query and deletes
                // the first document that matches it

                    assert.equal(err, null);
                    console.log(res.result);

                });

            }

            previous = doc;

        },
        function(err) {

            assert.equal(err, null);

        }
    );

});
