var express = require('express'),
    app = express(),
    engines = require('consolidate');

// Settings for the template engine in express
// We register nunjucks template engine as being associated with the html extension.
app.engine('html', engines.nunjucks);
// Set the view engine app setting to html
app.set('view engine', 'html');
// Where our templates are located.
// __dirname is provided by node.js to access the full path to the directory in wich this file is stored 
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
    //hello in the name of the html file
    //then we pass an object with the values of the vars we are using
    res.render('hello', { name : 'Templates' });
});

app.use(function(req, res){
    res.sendStatus(404); 
});

var server = app.listen(3000, function() {
    var port = server.address().port;
    console.log('Express server listening on port %s', port);
});
