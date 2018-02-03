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
    actions: ['commitVote'],
    warning: ['approve', 'requestVotingRights'],
  },
  revealVote: {
    actions: ['revealVote'],
    warning: ['approve'],
  },
  vote: {
    actions: [
      'voterReward',
      'canBeWhitelisted',
      'determineReward',
      'tokenClaims',
      'challengeCanBeResolved',
      'updateStatus',
      'withdrawVotingRights',
      'rescueTokens',
      'commitVote',
      'revealVote',
    ],
    warning: ['requestVotingRights'],
  },
  search: {
    default: 'Type the name of a listing to check its registry status',
    actions: ['isWhitelisted'],
  },
}
