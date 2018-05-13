function tallyVotes (votes, options) {

  if (options.length === 1) {
    const option = options[0];
    const numberOfVotes = votes.filter(rank => rank.includes(option)).length;
    const percentageOfVotes = votes.length / numberOfVotes;

    return { option, numberOfVotes, percentageOfVotes}
  }

  let remainingOptions = options.slice();
  
  // create a tally object
  const tally = remainingOptions.reduce((acc, id) => Object.assign({[id]: 0}, acc), {})
 
  // Build up the tally by recording each voters highest ranked reminaing choice
  for (let vote of votes) {
    for (let choice of vote) {
      if (remainingOptions.includes(choice)) {
        tally[choice]++;
        break;
      }
    }
  }

  const highestCount = Math.max(...Object.values(tally));
  const winningOption = remainingOptions.reduce((acc, option) => {
    if (tally[option] > tally[acc]) return option;
    else return acc;
  })
  const tieForHighest = Object.values(tally).filter(e => e === highestCount).length > 1;

  // if the highest vote count is a majority, return result object
  if (!tieForHighest && highestCount >= votes.length / 2) {
    return {
      option: winningOption,
      numberOfVotes: highestCount,
      percentageOfVotes:  highestCount / votes.length,
    }
  } else {
    // if not, remove lowest vote counts
    const lowestCount = Math.min(...Object.values(tally));
    const updatedOptions = remainingOptions.filter(option => {
      return tally[option] !== lowestCount;
    })

    // if highestCount and lowestCount are equal, recursing won't help.
    if (highestCount === lowestCount) {
      return tieBreaker(votes, options)
    }

    // recurse over updated options
    return tallyVotes(votes, updatedOptions);
  }
}

function tieBreaker(votes, options) {
  const rankings = votes;
  const longestRankingLength = Math.max(...rankings.map(arr => arr.length));

  // create tally object
  const tally = options.reduce((acc, key) => Object.assign({[key]: 0}, acc), {})



  // iterate over ranks (1st, 2nd, 3rd)
  for (let i = 0; i < longestRankingLength; i++) {
    // iterate over array of rankings
    for (let ranking of rankings) {
      // if the choice is in options, increment its tally
      const choice = ranking[i];
      if (choice && options.includes(choice)) {
        tally[choice]++
      }
    }
    // if a single choice is in the lead, return it
    const totals = Object.values(tally);
    const highestTotal = Math.max(...totals);
    if (totals.filter(t => t === highestTotal).length === 1) {
      const option = options.filter(o => tally[o] === highestTotal)[0];
      const numberOfVotes = rankings.reduce((acc, ranking) => {
        if (ranking.includes(option)) return acc + 1;
        else return acc;
      }, 0)
      const percentageOfVotes = numberOfVotes / rankings.length;
      return {
        option,
        numberOfVotes,
        percentageOfVotes,
      }
    }
  }
  console.error('\n\n***\nOh shit, something went wrong.\n***\n')
}

module.exports = { tallyVotes }