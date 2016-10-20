var express = require('express'),
  app = express(),
  engines = require('consolidate'),
  MongoClient = require('mongodb').MongoClient,
  assert = require('assert'),
  bodyParser = require('body-parser'); //Node.js body parsing middleware.
  // body-parser extracts the entire body portion of an incoming request
  // stream and exposes it on req.body as something easier to interface with

// Settings for the template engine in express
app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname+'/views');
app.use(bodyParser.urlencoded({ extended: true }));
// bodyParser.urlencoded(): Parses the text as URL encoded data (which is how
// browsers tend to send form data from regular forms set to POST) and exposes
// the resulting object (containing the keys and values) on req.body.

// Handler for internal server errors
function errorHandler(err, req, res, next){
  console.log(err);
  res.status(500).render('error_template', { error: err});
  // error is a variable to store the error message and render in in the html error template.
}

MongoClient.connect('mongodb://localhost:27017/video', function(err, db){
  assert.equal(null, err);
  console.log("Successfully connected to MongoDB.");

  app.get('/', function(req, res, next) {
      res.render('index.html');
  });

  app.post('/favorite_movie', function(req, res, next){
    var title = req.body.title;
    var year = req.body.year;
    var imdbId = req.body.imbd;
    db.collection('movies').insertOne({
      'title': title,
      'year': year,
      'imbd': imdbId
    }, function(err, result){
      assert.equal(err, null);
      console.log("Inserted " + result.result.n + " documents into the document collection movies");
      res.render('result.html');

    });


  });

  app.use(errorHandler);

  var server = app.listen(3000, function() {
      var port = server.address().port;
      console.log('Express server listening on port %s.', port);
  });


});
