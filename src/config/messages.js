export default {
  home: {
    name: 'Home',
    heading: 'Home modal',
    default: 'Home default message',
  },
  login: {
    name: 'Login',
    heading: 'Login',
    default: 'No accounts found. Please make sure MetaMask is unlocked.',
    mainMethod: 'personalSign',
    subMessages: ['Registry is not deployed at this address on the selected network.'],
  },
  apply: {
    name: 'Apply',
    heading: 'Apply modal heading',
    default: 'To apply you must approve the Registry smart contract to transfer your tokens. Enter the amount of tokens you would like to approve and enable for registry transactions',
  },
  challenge: {
    name: 'Challenge',
    heading: 'Challenge',
    default: 'To challenge a listing, you must first approve the Registry smart contract to transfer your tokens. Enter the amount of tokens you would like to approve and enable for registry transactions',
  },
  voting: {
    name: 'Vote',
    heading: 'Vote modal heading',
    default: 'To vote for or against this listing, you must approve the Voting smart contract to transfer your tokens. Click to approve and enable voting transactions now',
  },
  activities: {
    name: 'Activities',
    heading: 'Your current activities',
    default: 'Your current activities',
  },
  search: {
    name: 'Search',
    heading: 'Search modal heading',
    default: 'Type the name of a listing to check its registry status',
  },
}