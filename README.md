# PollUp

A consensus-voting application

## Description

PollUp allows users to create polls which are results are determined using the [Condorcet method](https://en.wikipedia.org/wiki/Condorcet_method). Polls commonly use [First-past-the-post voting](https://en.wikipedia.org/wiki/First-past-the-post_voting), in which voters cast their vote for a single option, and the option with the largest number of votes wins. This leads to situations in which the winner has a plurality of the vote, rather than a majority. The Condorcet method allows voters rank their options in order of preference, then chooses a winner that satisfies a majority of voters.


## Installation

After cloning the repo, run `npm run build` to build the client-side code, then `npm start` to run the server.