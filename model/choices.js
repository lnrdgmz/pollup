const choicesDb = {};

/**
 * 
 * @param {string} pollId 
 * @param {string} userId 
 * @param {string[]} choices 
 */
module.exports.addChoices = function (pollId, userId, choices) {
  if (choicesDb[pollId] === undefined) {
    choicesDb[pollId] = [];
  }
  choices.forEach(choice => {
    choicesDb[pollId].push({
      user: userId,
      text: choice,
    })
  })
  return 'ok';
}

module.exports.getChoices = function (pollId) {
  if (choicesDb[pollId] === undefined) {
    return 'error';
  } else {
    return choicesDb[pollId];
  }
}