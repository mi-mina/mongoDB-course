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
- There is no declared schema, but
