// This is written to be used with Express 4. The video code is written in Express 3.
var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    bodyParser = require('body-parser');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true })); 

// Handler for internal server errors
function errorHandler(err, req, res, next) {
    
    console.error(err.message); //No recibo nada por aquí
    console.error(err.stack); //No recibo nada por aquí
    console.log(err); //Por aquí sí. Quizá lo anterior ya no funciona en Express 4?
    res.status(500).render('error_template', { error: err });
}

app.get('/', function(req, res, next) {
    res.render('fruitPicker', { 'fruits' : [ 'apple', 'orange', 'banana', 'peach' ] });
});

app.post('/favorite_fruit', function(req, res, next) {
    //We ask for the property 'fruta' because this is the value of the name attribute  of the input (in the template)
    //This is only available if we registered the bodyParser middleware
    var favorite = req.body.fruta;
    //console.log(req.body);  
    
    if (typeof favorite == 'undefined') {
        next('Please choose a fruit!');
    }
    else {
        res.send("Your favorite fruit is " + favorite);
    }
});

app.use(errorHandler);

var server = app.listen(3000, function() {
    var port = server.address().port;
    console.log('Express server listening on port %s.', port);
});
