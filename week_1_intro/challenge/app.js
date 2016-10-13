var express = require('express'),
  app = express(),
  engines = require('consolidate'),
  bodyParser = require('body-parser');

// Settings for the template engine in express
app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
