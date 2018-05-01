import { timestampToExpiry } from 'state/utils/_datetime'
import { BN } from 'state/libs/units'

export default {
  createDefaultListing: ({
    status = '1',
    listingHash = '0xc4dfa508fc49592be0f14ed8493c48d4e9b8af974632dea7ba61fa5dcf4d9e69',
    listingID = '0xd0d6d6c5fe4a677d343cc433536bb717bae167dd',
    owner = '0xd09cc3bc67e4294c4a446d8e4a2934a921410ed7',
    appExpiry = timestampToExpiry(1534147293),
    ts = '1534146993',
  }) => {
    return {
      listingHash,
      owner,
      status,
      txHash: '0x1edeec8517a7f2caa6ff9514f6904d650e25bcfada3ecf16a00814c6fa8b5354',
      blockHash: '0xf9e3dd9e37f601b78c0ce780e706517989b5e3fbc5bccd72177f834d81b90834',
      ts: BN(ts),
      data: 'QmVLmoaS3peX82wgFWBo1VFodTYuM1LzzdCBNzyHWkK97R',
      tokenData: {
        imgSrc:
          'https://raw.githubusercontent.com/kangarang/tokens/master/images/0xd0d6d6c5fe4a677d343cc433536bb717bae167dd.png',
      },
      listingID,
      unstakedDeposit: '100000000000000000000',
      appExpiry,
      commitExpiry: false,
      revealExpiry: false,
      pollID: false,
      challenger: false,
      challengeID: false,
      challengeData: false,
      challengeReward: false,
      votesFor: false,
      votesAgainst: false,
    }
  },
  createChallengeLog: ({
    msgSender = '0xd09cc3bc67e4294c4a446d8e4a2934a921410ed7',
    _eventName = '_Challenge',
    challengeID = BN('1'),
    challengeData = false,
    listingHash = '0xc4dfa508fc49592be0f14ed8493c48d4e9b8af974632dea7ba61fa5dcf4d9e69',
    data = 'QmVLmoaS3peX82wgFWBo1VFodTYuM1LzzdCBNzyHWkK97R',
  }) => ({
    eventName: _eventName,
    logData: {
      data,
      challengeID,
      challengeData,
      challenger: msgSender,
      commitEndDate: BN('1545147293'),
      revealEndDate: BN('1545547893'),
      listingHash,
      _eventName,
    },
    txData: {
      txHash: '0x1edeec8517a7f2caa6ff9514f6904d650e25bcfada3ecf16a00814c6fa8b5354',
      blockHash: '0xf9e3dd9e37f601b78c0ce780e706517989b5e3fbc5bccd72177f834d81b90834',
      ts: BN('1544146993'),
    },
    msgSender,
  }),
}
