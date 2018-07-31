const db = require('./db');


/**
 * 
 * @param {string} id 
 * @returns {object}
 */
module.exports.getPoll = function (code) {
  return db.query('SELECT * FROM polls WHERE code = $1', [code])
    .then(res => res.rows[0]);
}

/**
 * 
 * @param {object} pollObj
 * @param {string} pollObj.question
 * @param {string} pollObj.user
 * @param {number} pollObj.submitTimeEnd
 * @param {number} pollObj.voteTimeEnd
 */
module.exports.addPoll = function (pollObj) {
  let code;
  return generateUniqueCode()
    .then(code0 => {
      code = code0
      return db.query(
        'INSERT INTO polls (code, question, creator_id, submit_time_end, \
          vote_time_end) VALUES ($1, $2, $3, $4, $5)',
        [
          code,
          pollObj.question,
          pollObj.user,
          pollObj.submitTimeEnd,
          pollObj.voteTimeEnd
        ]
      )
    })
    .then(res => code)
    .catch(err => {
      console.log('There was a problem adding a poll');
      console.error(err);
    })
}


async function generateUniqueCode() {
  let code = randomCode();
  let exists = await pollExists(code);
  while (exists) {
    code = randomCode();
    exists = await pollExists(code);
  }
  return code;
}

const pollExists = function (pollCode) {
  return db.query('SELECT * FROM polls WHERE code = $1', [pollCode])
    .then(res => {
      return res.rows.length > 0;
    })
}
module.exports.pollExists = pollExists;

function randomCode() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += letters[Math.floor(Math.random() * 26)]
  }
  return result;
}