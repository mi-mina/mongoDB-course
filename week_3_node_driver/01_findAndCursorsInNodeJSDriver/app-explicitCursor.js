var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


MongoClient.connect('mongodb://localhost:27017/crunchbase', function(err, db) {

    assert.equal(err, null);
    console.log("Successfully connected to MongoDB.");

    var query = {"category_code": "biotech"};

    var cursor = db.collection('companies').find(query);
    // We have a call to the find method but we don't give it a callback
    // We save the cursor that find() returns in a variable
    // We haven't asked for anything yet. Just defined the query.

    // With code written this way, instead of consuming everything at once (as
    // it happens with the toArray method) and pulling it all into memory:
    // we are streaming the data to our application as we need them!!!!
        // Is this some sort of lazyness????
    // With the toArray method, the callback isn't call until we have received all the data.

    // Cursor objects provide a forEach method. It's not the same method as in arrays.
    // It takes two arguments. A function to apply to each element of the cursor and
    // a function for what to do when the cursor is exhausted or returns an error.
    // The cursor will be asking mongo for documents in batches and applying the
    // callback function to this documents before asking for the next batch. 

    cursor.forEach(
        function(doc) {
            console.log( doc.name + " is a " + doc.category_code + " company." );
        },
        function(err) {
            assert.equal(err, null);
            return db.close();
        }
    );

});
