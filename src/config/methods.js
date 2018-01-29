const allActions = {
  voting: {
    setters: ['commitVote', 'revealVote', 'requestVotingRights', 'withdrawVotingRights', 'rescueTokens'],
    getters: ['commitPeriodActive', 'revealPeriodActive', 'pollEnded', 'pollExists', 'isPassed', 'hasBeenRevealed', 'getInsertPointForNumTokens', 'getNumTokens', 'getNumPassingTokens', 'getTotalNumberOfTokensForWinningOption', 'voteTokenBalance'],
    all: ['requestVotingRights', 'withdrawVotingRights', 'rescueTokens', 'rescueTokens', 'commitVote', 'revealVote', 'startPoll', 'getLockedTokens', 'getInsertPointForNumTokens', 'getNumPassingTokens', 'getNumTokens', 'getTotalNumberOfTokensForWinningOption', 'voteTokenBalance', 'commitPeriodActive', 'getCommitHash', 'getLastNode', 'hasBeenRevealed', 'isExpired', 'isPassed', 'pollEnded', 'pollExists', 'pollMap', 'revealPeriodActive', 'validPosition']
  },
  token: ['approve', 'transfer', 'allowance'],
  registry: {
    apply: ['apply', 'deposit', 'appWasMade'],
    challenge: ['challenge'],
    getters: ['appWasMade', 'isWhitelisted', 'canBeWhitelisted', 'challengeCanBeResolved', 'voterReward'],
    setters: ['updateStatus', 'claimReward']
  }
}
  
export default {
  home: {
    name: 'Home',
    heading: 'Home methods',
    default: 'login',
    args: ['spender', 'owner', 'amount'],
    actions: ['approve', 'allowance', 'balanceOf', 'transfer'],
  },
  apply: {
    name: 'Apply',
    heading: 'Apply',
    default: 'Apply for a listing in the Registry.',
    args: ['listingHash', 'deposit', 'data'],
    actions: [...allActions.token, 'apply', 'deposit', 'appWasMade', ...allActions.voting.setters],
  },
  challenge: {
    name: 'Challenge',
    heading: 'Challenge',
    default: 'Challenge a listing. min_deposit will be transferred from your account.',
    args: ['listingHash'],
    actions: [...allActions.token, ...allActions.registry.challenge, ...allActions.voting.setters],
  },
  voting: {
    name: 'Voting',
    heading: 'Voting',
    default: 'Commit and reveal your secret vote',
    args: ['pollID', 'secretHash', 'numTokens', 'salt'],
    actions: [...allActions.voting.getters, ...allActions.voting.setters, ...allActions.token, ...allActions.registry.setters],
  },
  activities: {
    name: 'Activities',
    heading: 'Your current activities',
    default: 'Your current activities',
    actions: [],
  },
  search: {
    name: 'Search',
    heading: 'Search modal heading',
    default: 'Type the name of a listing to check its registry status',
    args: ['listingHash'],
    actions: [],
  },
}
