const _ = require('lodash');


function tallyVotes(votes, choices) {
  const winner = findCondorcetWinner(votes, choices) || findPointBasedWinner(votes, choices);

  const numVotes = votes.reduce((acc, ballot) => ballot.includes(winner) ? acc + 1 : acc, 0)
  const percentage = numVotes / votes.length
  return {
    option: winner,
    numberOfVotes: numVotes,
    percentageOfVotes: percentage,
  }
}

function findPointBasedWinner(votes, choices) {
  // record points in an object
  const points = {};
  for (const choice of choices) {
    points[choice] = 0;
  }
  let greatestPoints = 0;

  // iterate through ballots
  for (const ballot of votes) {
    // iterate through each choice in a ballot
    for (let i = 0; i < ballot.length; i++) {
      // increment that choice's points by 1/(i + 1)
      points[ballot[i]] += 1 / (i + 1);

      if (points[ballot[i]] > greatestPoints) {
        greatestPoints = points[ballot[i]];
      }
    }
  }
  
  const winners = _.map(points, (val, key) => ({choice: key, points: val}))
  .filter(choice => choice.points === greatestPoints);
  
  // if there is a clear winner, return that choice
  if (winners.length === 1) {
    return winners[0].choice
  } else {
    // if there's a tie, choose a random choice from highest scoring
    const randomIndex = _.random(0, winners.length - 1);
    return winners[randomIndex].choice;
  }


}

function findCondorcetWinner(votes, choices) {
  // make an empty matrix using the choices array
  // iterate through votes and add them to the matrix
  const results = votes.reduce(function (acc, ballot) {
    return addMatrices(acc, ballotToMatrix(ballot, choices))
  }, makeZeroMatrix(choices.length))
  return findWinnerInMatrix(results, choices);
}

function findWinnerInMatrix(matrix, choices) {
  for (let i = 0; i < choices.length; i++) {
    for (let j = 0; j < choices.length; j++) {
      if (matrix[i][j] < matrix[j][i]) {
        // If this choices ever gets beaten, break out of the inner loop, avoiding the return statement
        break;
      } else if (j === choices.length - 1) {
        // If we make it to the end of the row, this choice is the condorcet winner
        return choices[i]
      }
    }
  }
  // If we reach this point, there is no condorcet winner and a winner needs to be determined by other means.
  return null
}

function makeEmptyMatrix(length) {
  return Array(length).fill(undefined).map((_, i) => {
    const row = Array(length).fill(undefined);
    row[i] = 0;
    return row
  })
}

function makeZeroMatrix(length) {
  return Array(length).fill(undefined).map((_, i) => {
    return Array(length).fill(0);
  })

}

function ballotToMatrix(ballot, choices) {
  const matrix = makeEmptyMatrix(choices.length);
  for (let vote of ballot) {
    const i = choices.indexOf(vote);
    // switch all undefined values to 1 in this candidate's row
    matrix[i].forEach(function (value, col, collection) {
      if (value === undefined) {
        collection[col] = 1;
      }
    })
    // then switch all undefined values to 0 in the column
    matrix.forEach(function (row, index) {
      if (row[i] === undefined) {
        row[i] = 0;
      }
    })
  }
  return matrix;
}

function addMatrices(left, right) {
  const result = left.map(function (row, index) {
    const newRow = row.map(function (elem, j) {
      return elem + right[index][j];
    })
    return newRow;
  })
  return result;
}

module.exports = { tallyVotes }