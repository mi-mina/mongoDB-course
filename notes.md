# Week 1. Introduction.

### Installing MongoDB

From the Mongo page
https://docs.mongodb.com/v3.2/tutorial/install-mongodb-on-os-x/

I installed mongoDB using Homebrew.  
`brew install mongo`

After installing MongoDB with Homebrew:

- The databases are stored in the
 `/usr/local/var/mongodb/` directory
- The mongod.conf file is here: `/usr/local/etc/mongod.conf`
- The mongo logs can be found at `/usr/local/var/log/mongodb/`
- The mongo binaries are here: `/usr/local/Cellar/mongodb/[version]/bin`

Then we need to create a /data/db directory where mongoDB stores the databases by default
- `sudo bash` (to become root)
- `mkdir -p /data/db` (creates data/db in the root directory)
- `chmod 777 /data`
- `chmod 777 /data/db` (to have permissions to write)
- `exit` (to exit the root shell)

Binaries are already copied to `/usr/local/bin/mongo`, so we can type `mongod` and `mongo` from everywhere.

Aside:  
To open a file with TextEdit  
`open -a TextEdit filename`

### Running MongoDB

First we need to run `mongod` in a shell to start the server in port 27017. (To close the server `Ctrl + C`).  
27017 is the port by default. If we want to start the mongo server in other port, we type:
`mongod --port 27018` (the port number we want to use)

Then we open a new terminal and run `mongo` to open the mongo shell. Typing `help` shows us a list of commands available.

The mongo shell is a fully functional MongoDB client application. All CRUD operations are supported. It's also a fully JS interpreter.

In MongoDB, a collection and the database that contains it form a namespace. Ex: `video.movies` specifies the movies collection in the `video` database.

`use (database name)` starts using the specified database. If it doesn't exist, it created it.

`db.(collection name).insertOne({...})` to insert a new document.

`db.(collection name).find().pretty()` to find all the documents in that collection.

`db.(collection name).find({'title': 'Jaws'}).pretty()` to find the documents which title is Jaws.

**Important** What `find()` returns is a *cursor* object, it's not just an array of documents. That means that we can iterate through the return documents using `hasNext()` and `next()`

### Node and npm

`npm install (name of the package)`  
For example: `npm install mongodb` to install the mongoDB driver.

`npm install --save (name of the package)` to install the package and save it to he package.json file.

If there is a package.json file, just type `npm install`

### Database dump.
Open a terminal window and navigate to the directory so that the dump directory is directly beneath you. Dump files are binary files (they're not human-readable).

`mongorestore dump`

# Week 2. CRUD operations

#### Creating documents
Principal commands for creating documents:
- insertOne();
- insertMany();
- Update commands can result in document being inserted. ('Upserts')

`db.(collection name).insertOne({...})` to insert a new document.

`db.(collection name).insertMany([{...}, {...}, {...}])` to insert many documents.
insertMany inserts documents ordered by default. If it founds an error (i.e. a doubled \_id), it stops at that point.

`db.(collection name).insertMany([{...}, {...}, {...}], { "ordered": false})` to insert many documents.



# Week 3. Node.js driver

![schema](https://raw.githubusercontent.com/mi-mina/mongoDB-course/master/week_3_node_driver/Screen%20Shot%202016-10-29%20at%2011.34.32.png)

[Crunchbase. Startups database](https://www.crunchbase.com/#/home/index)

`mongoimport -d crunchbase -c companies companies.json`
Allows to import human-readable json files. `-d`for the database name and `-c`for the collection name. Then the path to the json file.

`mongoimport --drop -d crunchbase -c companies companies.json` does the same but it drops the collection before, in case that it exists.

The driver provides one set of classes and methods we use to interact with mongoDB and the mongo shell provides its own API. With respect to CRUD, MongoDB 3.2 shell and drivers adhere to the same CRUD spec. They support the same set of CRUD methods (findOne, insertMany, etc)

Documents in a MongoDB database collections doesn't need to have the exact same fields.

# Week 4. Mongo Schemas

In relational databases there is a best way to design your schema which is to keep it in the third normal form.
In mongo is more important to keep the data in a way that's conducive to the application using the data.
The data within mongo is organized to specifically suit the application data access patterns.
In relational databases you try to keep the data in a way that's agnostic to the application.

- Mongo supports Rich Documents. It's not just tabular data. You can store an array of items...
- Allows us to pre join/embed data
- Mongo doesn't support joins. You have to join in the application itself. You have to think ahead of time what data you want to use together with other data, and if it's possible, you might want to embed it directly.
- There are no constrains.
- Mongo don't support transactions, but it support atomic operations.
- There is no declared schema


# Week 5. Indexes.

To create an Index  
`db.collectionname.createIndex({keyyouwanttoindexby: 1})`

Ex: `db.students.createIndex({student_id: 1, class_id -1})`

1 is to ascend index
-1 to descend index

To know which indexes are there  
`db.collectionname.getIndexes()`

To delete an index
`db.collectionname.dropIndex({indexname: 1})`

Ex: `db.students.dropIndex({"student_id" : 1})`

We have to give the same index we gave when we created it.

#### Multikey Indexes
When we have an array as a value of one of the keys we want to index by.
Restrictions: You can't have a compound index where both of them are arrays.

#### Dot Notation and Multikey
```
{
	"_id" : ObjectId("5828399e81dd97f22908780f"),
	"student_id" : 2968,
	"scores" : [
		{
			"type" : "exam",
			"score" : 35.54178258373225
		},
		{
			"type" : "quiz",
			"score" : 99.00037083179335
		},
		{
			"type" : "homework",
			"score" : 60.97754160761348
		},
		{
			"type" : "homework",
			"score" : 47.47333988699136
		}
	],
	"class_id" : 97
}
```
In this type of document, we can create this kind of index:

`db.students.createIndex({'scores.score': 1})`

If we want to find a document where at least one score is greater than 99 ->

`db.students.find({'scores.score': {'$gt' : 99}}).pretty()`

But what if we want to find a document where the exam is above 99? We need to do
it like this:

`db.student.find({'scores': {$elemMatch: {type: 'exam', score: {$gt: 99}}}})`

If we want to sort on multiple fields, the direction of each field on which we want to sort in a query must be the same as the direction of each field specified in the index. So if we want to sort using something like db.collection.find( { a: 75 } ).sort( { a: 1, b: -1 } ), we must specify the index using the same directions, e.g., db.collection.createIndex( { a: 1, b: -1 } ).

#### Unique Indexes
Doesn't allow duplicate values for the same key. To create one:

`db.students.createIndex({name: 1}, {unique: true})`

#### Sparse Indexes
When the index key in missing for some of the documents.

For example, you want to create a unique index on the key 'cell_phone' of your
database of employees because every employee should have a different cell phone
number. But there might be some employees without cell phone.
You can't create a unique index because for all documents with no cell key,
a cell key will be assigned to null in the index.
With the sparse option it's possible though, because the documents with the
missing key won't be included in the index.

`db.employees.createIndex({cell: 1}, {unique:true, sparse: true})`

A sparse index will be used in a find() but not in a sort() because mongo knows
that it has missing documents.

#### Background/Foreground

Indexes can be created in the Foreground or in the Background.
In the Foreground are fast but the database will be blocked.
In the Background are slower but the database doesn't block.

`db.students.createIndex({scores.score: 1}, {foreground: true})`

#### Explain
Explain is used to find out what the database is doing when you run a query.
It doesn't return back the data, just show what it would do.

`db.foo.explain()` returns an explainable object.
You can run a lot of methods on the explainable object (but insert), including help, which returns what methods you can apply.

Ex: `db.foo.explain().find()`

Explain can run in different modes with increasing levels of verbosity:
- queryPlanner (default). Doesn't return the data
- executionStats
- allPlansExecution

Ex: `db.foo.explain({'executionStats'}).find()`

#### Covered query
A covered query is a query where the query itself can be satisfied entirely with an index and hence, zero documents need to be inspected to satisfy the query.
It only works in the case that we explicitly project the keys in the index

Examples.
We have a foo collection with an index on the keys j and k.
This query is not covered. Although we are only looking for keys in the index, the return documents will have information about the \_id key, and the \_id key is not indexed, so it will have to scan the documents.   
`db.foo.explain('executionStats').find({j:1, k:1})`

To avoid that, we can explicitly exclude the \_id key with a projection:
`db.foo.explain('executionStats').find({j:1, k:1}, {_id:0, j:1, k:1})`

If we forget to explicitly ask for k and j in the projection, it won't be a covered query either, because mongo is not sure that they aren't other keys like m or n...

#### stats
Indexes are stored in memory, not in disk.
To know how big they are:  
`db.foo.stats()`

#### Index cardinality
Index cardinality: how many index points are there for each different type of index that Mongo supports.
- Regular -> same index points as number of documents
- Sparse -> less or equal index points as number of documents
- Multikey -> more index points as number of documents

#### Geospatial Indexes
They allow you find places based on location.

##### 2D
In your documents you have to have a key called like 'location' or something similar where to store an x value and a y value. For example:
```
{
  '_id': ObjectId(12231231231231243)
  'name': "Ruby's"
  'type': 'barber'
  'location': [40, 74]
}
```

To create an index based on location:  
`db.stores.createIndex({location: 2d, type: 1})`  

`type: 1` means ascending

For the query we need to use the special operator $near:  
`db.stores.find({location: {$near: [50, 50]}})`
'Find me every document whose location is near 50, 50'

If we want to limit the number of results:
`db.stores.find({location: {$near: [50, 50]}}).limit(10)`

##### Spherical
google maps shows the latitude and the longitude of a place (in that order).  
Mongo needs the values in the opposite order, first latitude and then longitude.

MongoDB uses geojson, but only support point and polygons.
```
{
  '_id': ObjectId(12231231231231243)
  'name': "Ruby's"
  'type': 'barber'
  'location': {
      'type': 'point',
      'coordinates': [40, 74]
    }
}
```
location it's not a reserved world (you can use whatever you want), but type, point, coordinates are (from the geojson specification).

To create a spherical index:   
`db.places.createIndex({location: 2dsphere})`

To make a find query: (coordinates: longitude, latitude and distance in meters)
```
db.places.find({
  location: {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [50, 50]},
      $maxDistance: 2000
    }  
  }
}).pretty()`
```

#### Full text search index
Allows to do queries in texts.

To create an index of the text type:  
`db.sentences.createIndex({words: 'text'})`

To make a find query:    
`db.sentences.find({$text: {$search: 'dog'}})`

To find the best match:  
`db.sentences.find({$text: {$search: 'dog tree obsidian'}}, {$score: {$meta: 'textScore'}}).sort({$score: {$meta: 'textScore'}})`

#### Efficiency
The primary factor that determines how efficiently an index can be used is the selectivity of the index.

Rules of thumb you should keep in mind when building compound indexes:  
- Equality fields before range fields
- Sort fields before range fields
- Equality fields before sort fields

#### Logging
When the queries are slow, they're logged in the mongod shell automatically.

#### Profiler
It's a more sophisticated facility. It will write entries in system.profile.
There are 3 levels:  
- Level 0. Default. Profiler off.
- Level 1. Will log slow queries.
- Level 3. Will log all queries. It's more like a general debugging feature.

Start the mongo server like this:  
`mongod --profile 1 --slowms 2`

To see the log:  
`db.system.profile.find().pretty()`

We can do queries in this document:  
`db.system.profile.find({ns: 'school.students'}).sort({ts: 1}).pretty()`

To ask about or set the profiler level and ask about the status:  
`db.getProfilingLevel()`  
`db.setProfilingLevel(1, 4)`   
`db.getProfilingStatus()`  

#### Mongo top
High level view of where Mongo is spending time.

`mongotop 3`  
runs mongotop every 3 seconds

#### mongostat
Similar to the iostat command in Unix
It will sample the database in one second increments and give you a bunch of information about what is going on in that second, like number of inserts, queries, updates, deletes...

# Sharding
Sharding is a technique for splitting up a large collection amongst multiple servers.

You can have multiple mongo servers. In front of them you have a mongos (a router). The application talks to mongos, which then talks to the various servers.

It's different of a replica set. In a replica set you store the same data. You keep the data in synch across several different instances so that if one of them goes down, you won't lose your data. But one replica set is seen as a shard.

In mongo, you choose a shard key, it could be a compound key.
For example, student_id. Mongos will send the request to the right mongo instance.

- **An insert must include the entire shard key**
- **For an insert, uodate or delete, if you don't include the shard key, mongos will broadcast the request to all the different shards, and you will get a worst performance.**

# Week 6. Aggregation Framework

[Aggregation pipeline quick reference](https://docs.mongodb.com/v3.2/meta/aggregation-quick-reference/)

Analytic tools. It's based on the concept of a pipeline.
Stream of documents.
Pipelines work with a MongoDB collection. They're composed of stages each of which does a different data processing task on its input and produces documents as output to be passed to the next stage. In some cases is necessary to introduce the same type of stage, multiple times, within an individual pipeline.

#### Familiar operations
- match (find)
- project
- sort
- skip
- limit

We pass a pipeline to the aggregate method. A pipeline is an array with document as elements, and each document must stipulate a particular stage operator.
```
db.companies.aggregate([
  {$match: {founded_year: 2004}},
  {$sort: {name: 1}},
  {$limit: 5},
  {$project: {
    _id:0,
    name:1,
    }
  }
])
```
Always think about the efficiency of the pipeline. Be careful about the order.
$match should be on of the first stages.

#### Expressions
There are expressions supported in the aggregation framework

- booleans: $and, $or, $not
- set expressions. They allow us to treat arrays as sets and perform operations on them: $setEquals, $setIntersection, $setUnion, $setDifference, ...
- comparison operators: $eq, $gt, $gte, $lt, $lte...
- arithmetic expressions: $abs, $add, $ceil, $divide, $mod, $multiply
- String expressions
- Text search expressions
- Array expressions
- Variable expressions
- Date expressions
- Condicional expressions
- Accumulators

#### Reshaping documents. $project

##### Promoting nested fields

```
db.companies.aggregate([
    { $match: {"funding_rounds.investments.financial_org.permalink": "greylock" } },
    { $project: {
        _id: 0,
        name: 1,
        ipo: "$ipo.pub_year",
        valuation: "$ipo.valuation_amount",
        funders: "$funding_rounds.investments.financial_org.permalink"
    } }
]).pretty()
```
The `$` means 'give me the value'. (The nested value in this case)

##### Create a new nested document

```
db.companies.aggregate([
    { $match: {"funding_rounds.investments.financial_org.permalink": "greylock" } },
    { $project: {
        _id: 0,
        name: 1,
        founded: {
            year: "$founded_year",
            month: "$founded_month",
            day: "$founded_day"
        }
    } }
]).pretty()
```
#### $unwind

Unwind allows as to take documents as inputs that have an array valued field, and produce output documents such that there's one output document for each element in the array
```
db.companies.aggregate([
    { $match: {"funding_rounds.investments.financial_org.permalink": "greylock" } },
    { $unwind: "$funding_rounds" },
    { $project: {
        _id: 0,
        name: 1,
        amount: "$funding_rounds.raised_amount",
        year: "$funding_rounds.funded_year"
    } }
])
```

##### Homework week 6

###### 6.1
```
db.companies.aggregate( [     
  { $match: { "relationships.person": { $ne: null } } },     
  { $project: { relationships: 1, name: 1, _id: 0 } },     
  { $unwind: "$relationships" },
  {$match: {'relationships.person.permalink': 'josh-stein'} },     
  { $group: {         
    _id: "$relationships.person",  
    companies: {$addToSet: '$name' }
  } },     
  { $project: { num: { $size: '$companies'} } }
] ).pretty()
```
Official Solution:

```
db.companies.aggregate([
    { $project: { relationships: 1, _id: 0, name : 1, permalink: 1 } },
    { $unwind: "$relationships" },
    { $group: {
        _id: { person: "$relationships.person" },
        gross_companies: { $push : "$permalink" },
        unique_companies: { $addToSet : "$permalink" }
    } },
    { $project: {
        _id: 0,
        person: "$_id.person",
        gross_companies: 1,
        unique_companies: 1,
        unique_number_of_companies: { $size: "$unique_companies" },
        gross_number_of_companies: { $size: "$gross_companies" }
    } },
    { $sort: { unique_number_of_companies: -1 } }
]).pretty()
```

###### 6.2
```
db.grades.aggregate( [
  {$unwind: '$scores'} ,
  {$match: {$or: [{'scores.type': 'homework'}, {'scores.type': 'exam'} ] }  },
  {$group: {
    _id: {'student_id': '$student_id', 'class_id': '$class_id'},
    avgStudent: { $avg: '$scores.score'}
    } }  
] ).pretty()
```

```
db.grades.aggregate( [
  {$unwind: '$scores'} ,
  {$match: {$or: [{'scores.type': 'homework'}, {'scores.type': 'exam'} ] }  },
  {$group: {
    _id: {'student_id': '$student_id', 'class_id': '$class_id'},
    avgStudent: { $avg: '$scores.score'}
    } },
  {$group: {
    _id: '$_id.class_id',
    avgClass: {$avg: '$avgStudent'}
    } } ,
  {$sort: {avgClass: -1}}
] ).pretty()
```
Official Solution:

```
db.grades.aggregate( [
{ $unwind : "$scores" },
{ $match : { "scores.type" : { $ne : "quiz" } } },
{ $group : { _id : { student_id : "$student_id", class_id : "$class_id" }, avg : { $avg : "$scores.score" } } },
{ $group : { _id : "$_id.class_id", avg : { $avg : "$avg" } }},
{ $sort : { "avg" : -1 } },
{ $limit : 5 } ] )
```

###### 6.3

```
db.companies.aggregate([
  {$project: {
    _id:0,
    'founded_year': 1,
    'funding_rounds.raised_amount': 1,
    funding_size: {$size: '$funding_rounds'}
  }},
  {$match: {$and: [
    {'founded_year': 2004},
    {funding_size: {$gte: 5}}
    ]}}
]).pretty()

```

```
db.companies.aggregate([
  {$match: {'founded_year': 2004}},
  {$project: {
    _id:0,
    'founded_year': 1,
    'funding_rounds.raised_amount': 1,
    funding_size: {$size: '$funding_rounds'}
  }},
  {$match: {funding_size: {$gte: 5}}}
]).pretty()

```
Solution:
```
db.companies.aggregate([
  {$match: {'founded_year': 2004}},
  {$project: {
    _id:0,
    'name': 1,
    'funding_rounds.raised_amount': 1,
    funding_size: {$size: '$funding_rounds'}
  }},
  {$match: {funding_size: {$gte: 5}}},
  {$unwind: '$funding_rounds'},
  {$group: {
    _id: {'company': '$name'},
    funding_average: {$avg: '$funding_rounds.raised_amount'}
    }},
  {$sort: {funding_average: 1}}
]).pretty()

```

Official Solution:

```
db.companies.aggregate([
    { $match: { founded_year: 2004 } },
    { $project: {
        _id: 0,
        name: 1,
        funding_rounds: 1,
        num_rounds: { $size: "$funding_rounds" }
    } },
    { $match: { num_rounds: { $gte: 5 } } },
    { $project: {
        name: 1,
        avg_round: { $avg: "$funding_rounds.raised_amount" }
        } },
    { $sort: { avg_round: 1 } }
]).pretty()
```
**$avg can be used inside $project too!!!!**

# Week 7. Application Engineering

#### Write concern

In the server, where MongoDB is running, there are several parts: CPU is running the Mongod program. And there's memory, and inside the server, there is this persistent disk.

In Memory there are 2 structures:  
1. The database is mostly writing to memory, in WiredTiger for example, there'll be a cache of pages inside memory that are periodically written and read from disk, depending on memory pressure.

2. The journal: a log of every single thing that the database processes. Every single write the database processes. And when you do a write to the database, an update, it also writes to this journal.

But the data is only considered to be persistent when written to disk.

So when you do an update, you're going to contact via the network --via a TCP connection-- this server. And the server it's going to write it into the memory pages. But they may not write to disk for quite a while. It's also going to simultaneously write this update into the journal.

Now, by default in the driver, when you do an update, we wait for a response. It's an acknowledged update or an acknowledged insert. **But we don't wait for the journal to be written to disk.** The journal might not be written to disk for a while.

The value that represents-- whether we're going to wait for this write to be acknowledged by the server-- is called w. And by default, it's 1, which means wait for this server to respond to my write.

But, by default, j equals false. And j, which stands for journal, represents whether or not we wait for this journal to be written to disk before we continue.

The implications are that when you do an update or an insert into MongoDB, you're really doing an operation in memory, and not necessarily to disk, which means, it's very fast. And then, periodically, the journal gets written out to disk. It might be every few seconds that it gets written out to disk.

But during this window of vulnerability when the data has been written into the server's memory, into the pages, but the journal has not yet been persisted to disk, if the server crashed, you could lose the data.

#### Network Errors

Even if you are running Mongo in a very conservative way (w=1, j=True), you might not receive a response. This doesn't necessarily mean that the insert or update wasn't written to disk. A network error could have happened.

If you get an error and your not sure if it was written, if the operation is idempotent, you can try it again without problem. But if the operation is not idempotent, like an update with $inc, that's a problem.

#### Replication
1. Availability. If one node goes down you'll still be able to use the system
2. Fault tolerance. If the primary node goes down, how do we make sure that we don't lose our data between the backups

A replica set is a set of MongoDB nodes that act together and all mirror each other in terms of the data. Theres one primary and the others are secondary, but that's dynamic. Data written to the primary will be asynchronously replicate to the secondaries. If the primary goes down, the remaining nodes will perform an election to elect the new primary.
The minimun number of servers is 3.

#### Types of replica set nodes
1. Regular. Has the data and can become primary
2. Arbiter. It's there just for voting purposes. No data on it.
3. Delayed. It can participate in the voting but it can not became a primary node and to achieve this, its priority is set to 0.
4. Hidden. Never the primary, can participate in the elections. Used for analytics.

Every node has one vote.

#### Write consistency
The writes must go to the primary but the reads don't, they can go to the secondaries.
But if you write and read to primary, you get strong consistency between reads and writes.

#### Creating a replica set
To create a replica set in one computer we use different ports so they don't conflict with each other

Script: create_replica_set.sh

```
#!/usr/bin/env bash

mkdir -p /data/rs1 /data/rs2 /data/rs3
mongod --replSet m101 --logpath "1.log" --dbpath /data/rs1 --port 27017 --oplogSize 64 --fork --smallfiles
mongod --replSet m101 --logpath "2.log" --dbpath /data/rs2 --port 27018 --oplogSize 64 --smallfiles --fork
mongod --replSet m101 --logpath "3.log" --dbpath /data/rs3 --port 27019 --oplogSize 64 --smallfiles --fork
```

Using #!/usr/bin/env NAME makes the shell search for the first match of NAME in the $PATH environment variable. It can be useful if you aren't aware of the absolute path or don't want to search for it.

The script first creates 3 new directories and then it's going to start 3 mongod instances. It has to declare that each one is part of the same replica set, in this case called m101.

To specify a dbPath for mongod to use as a data directory, use the --dbpath option.

Then we define the 3 ports, one for each mongod

To run a mongod process as a daemon (i.e. fork), and write its output to a log file, use the --fork and --logpath options.

daemon: The conventional name for a background, non-interactive process.

--fork allows it to return, and that way, we don't have to run each mongod on its own shell.

After running `bash < create_replica_set.sh` we get 3 servers running, but they're not initialized yet to know about each other. To tie them together we have to give a command inside the mongo shell

init_replica.js:

```
config = { _id: "m101", members:[
          { _id : 0, host : "localhost:27017"},
          { _id : 1, host : "localhost:27018"},
          { _id : 2, host : "localhost:27019"} ]
};

rs.initiate(config);
rs.status();
```
To connect a mongo shell we must specify the port, because now we have 3 mongo servers running.
If we type: `mongo --port 27017` we just connect to the shell
We have to type `mongo --port 27017 < init_replica.js` to initialize the replica set

If we type: `mongo --port 27017` again, now we get `m101:PRIMARY>`

If we type: `mongo --port 27018` again, now we get `m101:SECONDARY>`

With `rs.status()` we get the configuration file for this replica set

You can't query secondary by default, in order to allow it: `rs.slaveOk()`

#### Replication internals
Each replica in the set has inside it an oplog, that is kept in sync with mongo.
The secondaries are going to be constantly reading the oplog of the primary.

`ps -ef | grep mongod` shows us the processes that are running, in this case, our 3 mongod

If we connect to a primary node, and type `use local`, `show collections`, we can see that there's an oplog.rs collections. To see what's inside: `db.oplog.rs.find().pretty()`

The oplog is a capped collection, which means that it's going to roll off after a certain amount of time. And so you need to have a big enough oplog to be able to deal with periods where the secondary can't see the primary. And how large that oplog is going to be is going to depend on how long you might expect there to be a bifurcation in the network and also how much data you're writing, how fast is the oplog growing.

So in a very fast-moving system, you might need a very large oplog. But in a smaller system, which isn't moving very fast where there aren't very many network partitions, you won't need a very large oplog to make sure that it can always see the oplog.

If the oplog rolls over and the secondary can't get to the primary's oplog, you can still re-sync the secondary, but he has to read the entire database, which is much, much slower.

And the other thing to note about the oplog is that this oplog uses this statement-based approach, where these are actually MongoDB documents. And it doesn't matter which storage engine you're using, or even which version of MongoDB you're running, to some extent. And so you can have mixed mode replica sets.

For instance, you can have a WiredTiger secondary and an mmap primary. And in fact, this is one of the features that would allow you to do upgrades. Because if you want to do a rolling upgrade of the system, you can do it by upgrading parts of it at a time and then having, let's say, a 30 primary replicating itself to an older secondary. And then switch it around, and eventually all the nodes get upgraded.

##### Elections
We're going to kill a mongod to see how fast a new primary is elected.
We run `ps -ef | grep mongod` to see in which process is the PRIMARY running.
And we kill it: `kill 2382`
Then we can see how a Secondary has turn into a primary.

#### Failover and rollback


#### Connecting to a replica set from node.js

You give the driver a connection string, with the hostnames and the ports you want to connect to. Or you could give the name and port of a single node and the driver will automatically detect that it's a replica set and discover the rest of the nodes.

Another way to start a replica set (without script):

1. Create `/data/s1` `/data/s2` and `/data/s3` directories

2. Type
```
mongod --port 30001 --replSet repl_set --dbpath /data/s1
mongod --port 30002 --replSet repl_set --dbpath /data/s2
mongod --port 30003 --replSet repl_set --dbpath /data/s3
```
in different shells

3. In another shell, connect to mongo in 3001  
`mongo localhost:30001`  
`rs.status()` gives us an error    
`rs.initiate()`  
`rs.add("Esperanzas-MacBook-Pro.local:30002")`  
`rs.add("Esperanzas-MacBook-Pro.local:30003")`  
`rs.status()`  

####
