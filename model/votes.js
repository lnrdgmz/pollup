const db = require('./db');

function votesRowsToVoteObject (rows) {
  return rows.reduce((acc, row) => {
    if (acc[row.user_id] === undefined) {
      // add user array to acc
      const arr = [];
      arr[row.rank - 1] = row.choice;
      acc[row.user_id] = arr;
    } else {
      // add vote to user's array
      acc[row.user_id][row.rank - 1] = row.choice;
    }
    return acc;
  }, {})
}

module.exports.getVotesForPoll = function (pollCode) {

  return db.query(
    'SELECT votes.user_id, votes.rank, votes.choice from polls, votes \
    WHERE polls.code = $1 AND polls.poll_id = votes.poll_id;',
    [pollCode]
  )
  .then(res => res.rows)
  .then(rows => {
    return Object.values(votesRowsToVoteObject(rows));
  })
}

module.exports.getUserVotesForPoll = function (pollCode, userId) {
  return db.query(
    'SELECT votes.user_id, votes.rank, votes.choice from polls, \
    votes WHERE polls.code = $1 AND polls.poll_id = votes.poll_id \
    AND votes.user_id = $2',
    [pollCode, userId]
  )
  .then(res => res.rows)
  .then(rows => {
    return Object.values(votesRowsToVoteObject(rows))[0];
  })
}

/**
 * 
 * @param {string} pollId 
 * @param {string} userId 
 * @param {string[]} ranking 
 */
module.exports.addVote = function (pollCode, userId, ranking) {
  let client;
  return db.connect()
    .then(client0 => {
      client = client0;
      return getPollIdFromCode(client, pollCode);
    })
    .then(pollId => {
      const ps = ranking.map((choice, index) => {
        return client.query(
          'INSERT INTO votes (poll_id, user_id, rank, choice) \
          VALUES ($1, $2, $3, $4)',
          [pollId, userId, index + 1, choice]
        )
      })
      return Promise.all(ps);
    })
    .then(res => {
      client.release();
      return res;
    })
    .catch(err => {
      client.release;
    })
}

function getPollIdFromCode(client, pollCode) {
  return client.query('SELECT (poll_id) FROM polls WHERE code = $1', [pollCode])
  .then(res => {
    return res.rows[0].poll_id;
  })
}