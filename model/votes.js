const votes = {};

module.exports.getVotesForPoll = function (id) {

  console.log('looking for votes for poll code', id)
  console.log('This is votes:')
  console.log(votes)
  console.log('This is the poll votes')
  console.log(votes[id])
  if (votes[id] === undefined) {
    return [];
  } else {
    return Object.values(votes[id]);
  }
}

module.exports.getUserVotesForPoll = function (pollId, userId) {
  if (votes[pollId] && votes[pollId][userId]) {
    return votes[pollId][userId];
  } else {
    return [];
  }
}

/**
 * 
 * @param {string} pollId 
 * @param {string} userId 
 * @param {string[]} ranking 
 */
module.exports.addVote = function (pollId, userId, ranking) {
  if (votes[pollId] === undefined) {
    votes[pollId] = {};
  }
  votes[pollId][userId] = ranking
}