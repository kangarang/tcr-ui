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
    actions: ['apply', 'appWasMade', 'deposit', 'approve', 'allowance', 'balanceOf', 'transfer', 'transferFrom', 'withdraw'],
  },
  challenge: {
    name: 'Challenge',
    heading: 'Challenge',
    default: 'Challenge a listing. min_deposit will be transferred from your account.',
    args: ['listingHash'],
    actions: ['appWasMade', 'challenge', 'deposit', 'approve', 'allowance', 'requestVotingRights', 'withdrawVotingRights', 'updateStatus', 'isWhitelisted', 'canBeWhitelisted'],
  },
  voting: {
    name: 'Voting',
    heading: 'Voting',
    default: 'Commit and reveal your secret vote',
    args: ['pollID', 'secretHash', 'numTokens', 'salt'],
    actions: ['requestVotingRights', 'withdrawVotingRights', 'commitVote', 'revealVote', 'rescueTokens', 'getLockedTokens', 'getInsertPointForNumTokens', 'getNumPassingTokens', 'getNumTokens', 'getTotalNumberOfTokensForWinningOption', 'voteTokenBalance', 'commitPeriodActive', 'getCommitHash', 'getLastNode', 'hasBeenRevealed', 'isExpired', 'isPassed', 'pollEnded', 'pollExists', 'pollMap', 'revealPeriodActive', 'validPosition', 'approve', 'allowance', 'balanceOf', 'transfer', 'transferFrom'],
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