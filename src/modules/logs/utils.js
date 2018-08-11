import { v4 } from 'node-uuid'

export const eventTypes = {
  _Application: 'info',
  _ApplicationWhitelisted: 'success',
  _ApplicationRemoved: 'error',
  _PollCreated: 'info',
  _Challenge: 'info',
  _VoteCommitted: 'info',
  _VoteRevealed: 'info',
  _TokensRescued: 'info',
  _RewardClaimed: 'success',
  _ReparameterizationProposal: 'info',
  _NewChallenge: 'info',
  _ProposalAccepted: 'info',
  _ChallengeSucceeded: 'info',
  _ChallengeFailed: 'info',
  _ListingRemoved: 'error',
  _ListingWithdrawn: 'info',
  Approval: 'success',
  Transfer: 'success',
}

// Create a general notification from an event
export function generateNoti(uid, title, message, action) {
  return {
    uid: v4(),
    title,
    message,
    position: 'tl',
    autoDismiss: 0,
    dismissible: 'both',
    action,
  }
}

export function getNotificationTitleAndMessage(eventName, logData, tcr, listing) {
  let title, message
  switch (eventName) {
    case '_Application':
      title = `Application ${logData.listingID} applied`
      message = 'Click to review the listing'
      break
    case '_ApplicationWhitelisted':
      title = `Application ${listing.listingID} was added to the registry`
      message = 'Click to review the listing'
      break
    case '_ApplicationRemoved':
      title = `Application ${listing.listingID} removed`
      message = `View application ${listing.listingID} history`
      break
    case '_Challenge':
      title = `Application ${listing.listingID} was challenged`
      message = 'Click to vote'
      break
    case 'Approval':
      title = 'Tokens approved'
      message = 'View on Etherscan'
      break
    case '_VoteCommitted':
      title = `${logData.numTokens} tokens successfully committed`
      message = `Go to voting for ${listing.listingID}`
      break
    case '_VoteRevealed':
      title = 'Vote revealed'
      message = `Go to voting for ${listing.listingID}`
      break
    case '_TokensRescued':
      title = 'Tokens successfully rescued'
      message = 'View token transaction'
      break
    case '_ChallengeSucceeded':
      title = `Challenge against ${listing.listingID} succeeded`
      message = 'View challenge'
      break
    case '_ChallengeFailed':
      title = `Challenge against ${listing.listingID} failed!`
      message = `Votes in favor of listing: ${logData.votesFor}\nVotes against listing: ${
        logData.votesAgainst
      }`
      break
    case '_RewardClaimed':
      title = 'Successfully claimed reward'
      message = 'View token transaction'
      break
    case '_ListingRemoved':
      title = 'Listing `name` removed'
      message = 'View exit information'
      break
    case '_ListingWithdrawn':
      title = `Listing ${listing.listingID} withdrawn`
      message = `${listing.listingID} is no longer on the whitelist`
      break
    case 'Transfer':
      title = 'Transfer was successful'
      message = 'View transfer on Etherscan'
      break
    case '_ReparameterizationProposal':
      title = 'Parameter `name` proposed to be `proposal`' // Check if valid parameter?
      message = 'View parameter proposal'
      break
    case '_NewChallenge':
      title = 'Parameter `name` was challenged'
      message = 'Click to vote'
      break
    case '_ProposalAccepted':
      title = '`proposal` accepted'
      message = 'View parameter proposal'
      break
    default:
      title = `Event: ${eventName}`
      message = ''
      break
  }
  return { title, message }
}
