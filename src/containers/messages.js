export default {
  login: {
    heading: 'Login',
    default: 'No accounts found. Please make sure MetaMask is unlocked.',
    mainMethod: 'personalSign',
    subMessages: [
      'Registry is not deployed at this address on the selected network.',
    ],
  },
  apply: {
    heading: 'Apply',
    prerequisites:
      'To apply a listing to the Registry, you must first approve the Registry smart contract to transfer your tokens. Enter the amount of tokens you would like to approve and enable for registry transactions.',
  },
  challenge: {
    heading: 'Challenge',
    default:
      'To challenge a listing, you must first approve the Registry smart contract to transfer your tokens. Enter the amount of tokens you would like to approve and enable for registry transactions',
  },
  vote: {
    heading: 'Vote',
    default:
      'To vote for or against this listing, you must approve the Voting smart contract to transfer your tokens. Click to approve and enable voting transactions now',
  },
  activities: {
    heading: 'Your current activities',
    default: 'Your current activities',
  },
  search: {
    heading: 'Search modal heading',
    default: 'Type the name of a listing to check its registry status',
  },
}
