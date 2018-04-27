const polls = {};

/**
 * 
 * @param {string} id 
 * @returns {object}
 */
module.exports.getPoll = function (id) {
  if (polls[id] === undefined) {
    return {}
  } else {
    return polls[id];
  }
}

/**
 * 
 * @param {object} pollObj
 * @param {} pollObj.question
 * @param {} pollObj.submitTimeEnd
 * @param {} pollObj.voteTimeEnd
 */
module.exports.addPoll =  function (pollObj) {
  const code = generateUniqueCode();
  pollObj.code = code;
  polls[code] = pollObj;
  console.log(polls)
  return pollObj;
}

function generateUniqueCode() {
  let code = randomCode();
  while (polls[code] !== undefined) {
    code = randomCode();
  }
  return code;
}

module.exports.pollExists = function (pollId) {
  return polls.hasOwnProperty(pollId);
}

function randomCode() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += letters[Math.floor(Math.random() * 26)]
  }
  return result;
}