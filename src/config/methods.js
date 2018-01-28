const allTokenActions = ['approve', 'allowance', 'balanceOf', 'transfer', 'transferFrom']

const allVotingActions = ['requestVotingRights', 'withdrawVotingRights', 'rescueTokens', 'rescueTokens', 'commitVote', 'revealVote', 'startPoll', 'getLockedTokens', 'getInsertPointForNumTokens', 'getNumPassingTokens', 'getNumTokens', 'getTotalNumberOfTokensForWinningOption', 'voteTokenBalance', 'commitPeriodActive', 'getCommitHash', 'getLastNode', 'hasBeenRevealed', 'isExpired', 'isPassed', 'pollEnded', 'pollExists', 'pollMap', 'revealPeriodActive', 'validPosition']

export default {
  home: {
    name: 'Home',
    heading: 'Home methods',
    default: 'login',
    args: ['spender', 'owner', 'amount'],
    actions: ['approve', 'allowance', 'balanceOf', 'transfer', 'transferFrom'],
  },
  apply: {
    name: 'Apply',
    heading: 'Apply',
    default: 'Apply for a listing in the Registry.',
    args: ['listingHash', 'deposit', 'data'],
    actions: [...allTokenActions, 'apply', 'deposit', 'withdraw', 'appWasMade'],
  },
  challenge: {
    name: 'Challenge',
    heading: 'Challenge',
    default: 'Challenge a listing. min_deposit will be transferred from your account.',
    args: ['listingHash'],
    actions: [...allTokenActions, 'appWasMade', 'challenge', 'deposit', 'requestVotingRights', 'withdrawVotingRights', 'updateStatus', 'isWhitelisted', 'canBeWhitelisted'],
  },
  voting: {
    name: 'Voting',
    heading: 'Voting',
    default: 'Commit and reveal your secret vote',
    args: ['pollID', 'secretHash', 'numTokens', 'salt'],
    actions: [...allVotingActions, ...allTokenActions, 'tokenClaims', 'claimReward', 'voterReward', 'updateStatus', 'challengeCanBeResolved'],
  },
  activities: {
    name: 'Activities',
    heading: 'Your current activities',
    default: 'Your current activities',
    actions: ['requestVotingRights', 'withdrawVotingRights', 'canBeWhitelisted', 'isWhitelisted', 'commitVote', 'revealVote', 'rescueTokens'],
  },
  search: {
    name: 'Search',
    heading: 'Search modal heading',
    default: 'Type the name of a listing to check its registry status',
    args: ['listingHash'],
    actions: ['appWasMade', 'isWhitelisted', 'canBeWhitelisted'],
  },
}
