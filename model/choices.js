const db = require('./db');

function getPollIdFromCode(client, pollCode) {
  return client.query('SELECT (poll_id) FROM polls WHERE code = $1', [pollCode])
  .then(res => {
    console.log(res.rows)
    return res.rows[0].poll_id;
  })

}


/**
 * 
 * @param {string} pollId 
 * @param {string} userId 
 * @param {string[]} choices 
 */
module.exports.addChoices = function (pollCode, userId, choices) {
  let client;
  return db.connect()
    .then(client0 => {
      client = client0;
      return client.query('SELECT (poll_id) FROM polls WHERE code = $1', [pollCode])
    })
    .then(res => {
      return res.rows[0].poll_id;
    })
    .then(pollId => {
      const ps = choices.map(choice => {
        return client.query(
          'INSERT INTO choices (poll_id, creator_id, text) VALUES ($1, $2, $3);',
          [ pollId, userId, choice ]
        )
      })
      return Promise.all(ps)
    })
    .then(res => {
      client.release();
    })
    .catch(err => {
      client.release();
    })
}

module.exports.getChoices = function (pollCode) {
  return db.query(
    'SELECT choices.creator_id, choices.text FROM polls, choices \
    WHERE polls.code = $1 AND polls.poll_id = choices.poll_id;',
    [pollCode]
  )
  .then(res => res.rows)
}