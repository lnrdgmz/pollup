const db = require('./db');

const createPollTableQuery =
  'CREATE TABLE polls (' + // create polls table
  'poll_id SERIAL UNIQUE PRIMARY KEY, ' + // id -- auto
  'code char(4) UNIQUE NOT NULL, ' +// code -- char(4)
  'question varchar(200) NOT NULL, ' +// question -- varchar(200)
  'creator_id char(32) NOT NULL, ' +// creatorId -- char(32)
  'submit_time_end bigint NOT NULL, ' +// submitTimeEnd -- integer
  'vote_time_end bigint NOT NULL, ' + // voteTimeEnd -- integer
  'CHECK (vote_time_end > submit_time_end));'

const createChoicesTableQuesry =
  'CREATE TABLE choices (' + // create choices table
  'choice_id SERIAL UNIQUE PRIMARY KEY, ' + // id
  'poll_id integer REFERENCES polls NOT NULL, ' + // pollId 
  'creator_id char(32) NOT NULL, ' + // creatorId -- char(32)
  'text varchar(200) NOT NULL,'  + // text -- varchar(200)
  'UNIQUE (poll_id, text));'

const createVoteTableQuery =
  'CREATE TABLE votes (' + // create votes table
  'poll_id integer REFERENCES polls NOT NULL, ' + // pollId
  'user_id char(32) NOT NULL, ' + // userId -- char(32)
  'rank integer NOT NULL, ' + // rank integer
  'choice varchar(200), ' + // choice_id
  'UNIQUE (poll_id, user_id, rank));'