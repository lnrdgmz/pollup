require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const http = require('http');
const router = require('./routes');


const app = express();
app.enable('trust proxy')

app.locals.shuffle = require('lodash').shuffle

const fakeDb = {
  polls: {},
};

app.use(session({
  secret: 'JjlkjIIIJII99;,;akK',
}))

app.use(express.static(__dirname + '/public'))

app.use(bodyParser.urlencoded())

app.set('views', './views')
app.set('view engine', 'ejs')

// app.get('/', (req, res) => {
//   // res.sendFile(__dirname + '/landing.html')
//   console.log(req.originalUrl)
//   res.render('landing')
// })


app.use(router);
// const pollRoute = express.Router();

// pollRoute.get('/', (req, res) => {
//   res.send(req.pollCode);
// })
// pollRoute.get('/vote', (req, res) => {
//   res.send('voting for ' + req.pollCode);
// })
// function pollCodeMiddleware (req, res, next) {
//   req.pollCode = req.params[0].toUpperCase();
//   next();
// }
// app.use( /\/(\D\D\D\D)/, pollCodeMiddleware, pollRoute)



// app.get('/create', (req, res) => {
//   res.render('new-poll')
// })

// app.post('/create', (req, res) => {
//   const code = randomCode();
//   const options = req.body['poll-option'] || [];

//   const submissionsTime = parseInt(req.body['poll-submit-time'])
//   const voteTime = parseInt(req.body['poll-vote-time'])

//   fakeDb.polls[code] = {
//     question: req.body['poll-question'],
//     participants: req.body['poll-participants'],
//     submitTime: Date.now() + submissionsTime * 60000,
//     voteTime: Date.now() + (submissionsTime + voteTime) * 60000, // TODO fix this
//     options: Array.isArray(options) ? options : [options],
//     votes: {},
//   }
//   res.redirect('/poll/' + code)
// })

// function verifyCodeExists(req, res, next) {
//   const code = req.params.code;

//   if (fakeDb.polls[code] !== undefined) {
//     next()
//   } else {
//     res.status(404).send('That poll code does not exist.')
//   }
// }

// app.get('/poll/:code', verifyCodeExists, (req, res) => {
//   const code = req.params.code;
//   const poll = Object.assign({ code: req.params.code }, fakeDb.polls[req.params.code]);

//   const time = Date.now();

//   if (time > poll.voteTime) {
//     // use results handler
//     const results = tallyVotes(poll.votes, poll.options)
//     res.render('results', { results, poll })
//   } else if (time > poll.submitTime) {
//     // use vote handler
    
//     // TODO figure out how to pass a context to template
//     //const context = { shuffle: shuffle };
//     res.render('vote', {
//       poll,
//       code,
//       voted: fakeDb.polls[code].votes[req.session.id] !== undefined,
//     });
//   } else {
//     // use submit handler
//     res.render('add_options', {
//       poll,
//       code,
//       hostname: req.hostname,
//     })
//   }
// })

// app.post('/poll/:code', verifyCodeExists, (req, res) => {
//   const newOptions = req.body['poll-new-options'];
//   if (Array.isArray(newOptions)) {
//     newOptions.forEach(option => {
//       fakeDb.polls[req.params.code].options.push(option);
//     })
//   } else {
//     fakeDb.polls[req.params.code].options.push(newOptions);
//   }

//   res.redirect('/poll/' + req.params.code)
// })

// app.post('/vote/:code', verifyCodeExists, (req, res) => {
//   const poll = fakeDb.polls[req.params.code];

//   let ranking;

//   if (Array.isArray(req.body['votes'])) {
//     ranking = req.body['votes'];
//   } else {
//     ranking = [req.body['votes']];
//   }

//   poll.votes[req.session.id] = ranking;

//   res.redirect('/poll/' + req.params.code);
// })

// app.listen(8080, () => {
//   console.log('Listening on port 8080.')
// })

const server = http.createServer(app);

server.listen(process.env.PORT || 8080);


const WebSocket = require('ws');



const wss = new WebSocket.Server({ server: server })

wss.addListener('connection', (ws) => {
  ws.addListener('message', (msg) => {
    console.log(msg)
    if (msg === 'broadcast') {
      wss.clients.forEach(ws => {
        ws.send('THIS IS A BROADCAST')
      })
    } else {
      ws.send('ok')
    }
  })
  console.log('connection open')
  ws.send('hello')
})


// function randomCode() {
//   const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//   let result = '';
//   for (let i = 0; i < 4; i++) {
//     result += letters[Math.floor(Math.random() * 26)]
//   }
//   return result;
// }

// function addVotes(code, user, votes) {
//   if (Array.isArray(votes)) {
//     fakeDb.polls[code].votes[user] = votes;
//   } else {
//     fakeDb.polls[code].votes[user] = [votes];
//   }
// }

