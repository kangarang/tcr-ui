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
    actions: ['commitVote', 'approve', 'requestVotingRights'],
    warning: ['approve', 'requestVotingRights'],
  },
  revealVote: {
    actions: ['revealVote'],
    warning: ['approve', 'requestVotingRights'],
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
      'approve',
      'requestVotingRights',
    ],
    warning: ['requestVotingRights'],
  },
  search: {
    default: 'Type the name of a listing to check its registry status',
    actions: ['isWhitelisted'],
  },
}
