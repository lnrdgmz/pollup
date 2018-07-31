require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const http = require('http');

const app = express();
app.enable('trust proxy')

const server = http.createServer(app);

server.listen(process.env.PORT || 8080);

const wss = require('./ws-server')(server);
const router = require('./routes')(wss);

app.locals.shuffle = require('lodash').shuffle

app.use(session({
  secret: 'JjlkjIIIJII99;,;akK',
}))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded())
app.use(router);

app.set('views', './views')
app.set('view engine', 'ejs')

