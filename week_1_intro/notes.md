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
