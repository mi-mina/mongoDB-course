var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


MongoClient.connect('mongodb://localhost:27017/crunchbase', function(err, db) {

    assert.equal(err, null);
    console.log("Successfully connected to MongoDB.");

    var query = {"permalink": {$exists: true, $ne: null}};
    var projection = {"permalink": 1, "updated_at": 1};

    var cursor = db.collection('companies').find(query);
    cursor.project(projection);
    cursor.sort({"permalink": 1})

    var markedForRemoval = [];

    var previous = { "permalink": "", "updated_at": "" };

    // Cursor objects provide a forEach method. It's not the same method as in arrays.
    // It takes two arguments. A function to apply to each element of the cursor and
    // a function for what to do when the cursor is exhausted or returns an error.
    cursor.forEach(
        function(doc) {

            if ( (doc.permalink == previous.permalink) && (doc.updated_at == previous.updated_at) ) {
                markedForRemoval.push(doc._id);
            }

            previous = doc;
        },
        function(err) {

            assert.equal(err, null);

            var filter = {"_id": {"$in": markedForRemoval}};
            // The $in operator selects the documents where the value of a field
            // equals any value in the specified array.

            db.collection("companies").deleteMany(filter, function(err, res) {
              // deleteMany(filter, options, callback)

                console.log(res.result);
                console.log(markedForRemoval.length + " documents removed.");

                return db.close();
            });
        }
    );

});
