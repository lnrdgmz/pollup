const { tallyVotes } = require('./vote-counting')
const polls = require('./model/polls');
const choices = require('./model/choices');
const votes = require('./model/votes');

const Router = require('express').Router;

const router = Router();
// const fakeDb = {
//   polls: {},
// }

router.get('/', (req, res) => {
  res.render('landing')
})


router.get('/create', (req, res) => {
  res.render('new-poll')
})
function minutesToMilliseconds(mins) {
  return mins * 60000;
}
router.post('/create', (req, res) => {
  const options = req.body['poll-option'] || [];

  const submissionsTime = parseInt(req.body['poll-submit-time'])
  const voteTime = parseInt(req.body['poll-vote-time'])

  return polls.addPoll({
    question: req.body['poll-question'],
    submitTimeEnd: minutesToMilliseconds(submissionsTime) + Date.now(),
    voteTimeEnd: minutesToMilliseconds(voteTime + submissionsTime) + Date.now(),
    user: req.session.id,
  })
  .then(code => {
    choices.addChoices(code, req.session.id, Array.isArray(options) ? options : [options])
  
    res.redirect('/' + code)
  })

})

function verifyCodeExists(req, res, next) {
  const code = req.pollCode;
  const pollExists = polls.pollExists(code);

  if (pollExists) {
    next()
  } else {
    res.status(404).send('That poll code does not exist.')
  }
}

const pollRouter = Router();

function pollCodeMiddleware (req, res, next) {
  req.pollCode = req.params[0].toUpperCase();
  next();
}
router.use( /\/(\D\D\D\D)/, pollCodeMiddleware, pollRouter)

pollRouter.get('/', verifyCodeExists, async function(req, res) {
  const code = req.pollCode;

  const poll = await polls.getPoll(code);
  const pollChoices = await choices.getChoices(code);

  const time = Date.now();

  if (time > poll.vote_time_end) {
    const pollVotes = await votes.getVotesForPoll(code);
    const results = tallyVotes(pollVotes, pollChoices.map(o => o.text));
    res.render('results', { results, poll });
  } else if (time > poll.submit_time_end) {
    // use vote handler

    // TODO figure out how to pass a context to template
    //const context = { shuffle: shuffle };
    const userVote = votes.getUserVotesForPoll(code, req.session.id);
    res.render('vote', {
      poll,
      choices: pollChoices,
      currentVote: userVote,
    });
  } else {
    // use submit handler
    res.render('add_options', {
      poll,
      choices: pollChoices,
      hostname: req.hostname,
    })
  }
})



pollRouter.post('/', verifyCodeExists, (req, res) => {
  const newOptions = req.body['poll-new-options'];
  const code = req.pollCode;
  if (Array.isArray(newOptions)) {
    choices.addChoices(code, req.session.id, newOptions)
    // newOptions.forEach(option => {
    //   fakeDb.polls[code].options.push(option);
    // })
  } else {
    choices.addChoices(code, req.session.id, [newOptions])
    // fakeDb.polls[code].options.push(newOptions);
  }

  res.redirect('/' + code)
})

pollRouter.post('/vote', verifyCodeExists, (req, res) => {
  const code = req.pollCode;
  // const poll = fakeDb.polls[code];

  let ranking;

  if (Array.isArray(req.body['votes'])) {
    ranking = req.body['votes'];
  } else {
    ranking = [req.body['votes']];
  }

  // poll.votes[req.session.id] = ranking;
  votes.addVote(code,req.session.id, ranking);

  res.redirect('/' + code);
})


module.exports = router;