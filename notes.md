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
