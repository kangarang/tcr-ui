export default {
  apply: {
    actions: ['apply'],
    warning: ['approve'],
  },
  challenge: {
    actions: ['challenge'],
    warning: ['approve'],
  },
  commitVote: {
    actions: ['commitVote', 'requestVotingRights'],
    warning: ['approve', 'requestVotingRights'],
  },
  updateStatus: {
    actions: ['updateStatus'],
    warning: ['approve', 'requestVotingRights'],
  },
  revealVote: {
    actions: ['revealVote'],
    warning: ['approve', 'requestVotingRights'],
  },
  vote: {
    actions: [
      'approve',
      'voterReward',
      'canBeWhitelisted',
      'voteTokenBalance',
      'tokenClaims',
      'challengeCanBeResolved',
      'updateStatus',
      'rescueTokens',
      'requestVotingRights',
      'withdrawVotingRights',
      'getNumTokens',
    ],
    warning: ['requestVotingRights'],
  },
  search: {
    default: 'Type the name of a listing to check its registry status',
    actions: ['isWhitelisted'],
  },
}
