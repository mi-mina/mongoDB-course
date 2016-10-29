// The idea behind projections is that in many situations we only care about
// some of the fields in the documents returned.

// By projecting out just the fields we need, reponses will require less time to
// assemble on the database side, less time to transmit to the clients, and less
// time to process within those clients. We gain efficiency


var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


MongoClient.connect('mongodb://localhost:27017/crunchbase', function(err, db) {

    assert.equal(err, null);
    console.log("Successfully connected to MongoDB.");

    var query = {"category_code": "social"};
    var projection = {"name": 1, "category_code": 1, "_id": 0};

    var cursor = db.collection('companies').find(query);
    cursor.project(projection);

    cursor.forEach(
        function(doc) {
            console.log(doc.name + " is a " + doc.category_code + " company.");
            console.log(doc);
        },
        function(err) {
            assert.equal(err, null);
            return db.close();
        }
    );

});
