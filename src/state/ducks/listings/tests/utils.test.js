import { convertDecodedLogs, createListing } from '../utils'
import * as actions from '../actions'
import { BN } from 'state/libs/units'
import { timestampToExpiry } from 'state/utils/_datetime'
import { fromJS } from 'immutable'

describe('suite: ducks/listings/utils:', function() {
  describe('function: createListing', async () => {
    test('should correctly convert an _Application log -> listing entity', async () => {
      const applicationLog = {
        '0': BN('100000000000000000000'),
        '1': BN('1524147293'),
        '2': 'QmVLmoaS3peX82wgFWBo1VFodTYuM1LzzdCBNzyHWkK97R',
        deposit: BN('100000000000000000000'),
        appEndDate: BN('1524147293'),
        data: 'QmVLmoaS3peX82wgFWBo1VFodTYuM1LzzdCBNzyHWkK97R',
        listingHash: '0xc4dfa508fc49592be0f14ed8493c48d4e9b8af974632dea7ba61fa5dcf4d9e69',
        applicant: '0xd09cc3bc67e4294c4a446d8e4a2934a921410ed7',
        _eventName: '_Application',
      }
      const blockTxn = {
        txHash: '0x1edeec8517a7f2caa6ff9514f6904d650e25bcfada3ecf16a00814c6fa8b5354',
        blockHash: '0xf9e3dd9e37f601b78c0ce780e706517989b5e3fbc5bccd72177f834d81b90834',
        ts: '1524146993',
      }
      const applicationListing = {
        listingHash: '0xc4dfa508fc49592be0f14ed8493c48d4e9b8af974632dea7ba61fa5dcf4d9e69',
        owner: '0xd09cc3bc67e4294c4a446d8e4a2934a921410ed7',
        challenger: false,
        challengeID: false,
        pollID: false,
        status: '1',
        txHash: '0x1edeec8517a7f2caa6ff9514f6904d650e25bcfada3ecf16a00814c6fa8b5354',
        blockHash: '0xf9e3dd9e37f601b78c0ce780e706517989b5e3fbc5bccd72177f834d81b90834',
        ts: '1524146993',
        data: 'QmVLmoaS3peX82wgFWBo1VFodTYuM1LzzdCBNzyHWkK97R',
        tokenData: {
          imgSrc:
            'https://raw.githubusercontent.com/kangarang/tokens/master/images/0xd0d6d6c5fe4a677d343cc433536bb717bae167dd.png',
        },
        listingID: '0xd0d6d6c5fe4a677d343cc433536bb717bae167dd',
        unstakedDeposit: '100000000000000000000',
        appExpiry: await timestampToExpiry(applicationLog.appEndDate.toNumber()),
        commitExpiry: false,
        revealExpiry: false,
      }
      const actual = await createListing(
        applicationLog,
        blockTxn,
        '0xd09cc3bc67e4294c4a446d8e4a2934a921410ed7'
      )
      const expected = applicationListing
      expect(actual).toEqual(expected)
    })

    test('should throw an error if given a log other than _Application', async () => {
      const log = {
        '0': BN('100000000000000000000'),
        '1': BN('1524147293'),
        '2': 'QmVLmoaS3peX82wgFWBo1VFodTYuM1LzzdCBNzyHWkK97R',
        deposit: BN('100000000000000000000'),
        appEndDate: BN('1524147293'),
        data: 'QmVLmoaS3peX82wgFWBo1VFodTYuM1LzzdCBNzyHWkK97R',
        listingHash: '0xc4dfa508fc49592be0f14ed8493c48d4e9b8af974632dea7ba61fa5dcf4d9e69',
        applicant: '0xd09cc3bc67e4294c4a446d8e4a2934a921410ed7',
        _eventName: '_Applicaion',
      }
      const blockTxn = {
        txHash: '0x1edeec8517a7f2caa6ff9514f6904d650e25bcfada3ecf16a00814c6fa8b5354',
        blockHash: '0xf9e3dd9e37f601b78c0ce780e706517989b5e3fbc5bccd72177f834d81b90834',
        ts: '1524146993',
      }
      // The problem with your method is that if the promise resolves then the test will pass even though you expect it to reject.
      // The test should fail if the promise resolves. It should only pass if it rejects with the exact error that you expected.
      try {
        const actual = await createListing(
          log,
          blockTxn,
          '0xd09cc3bc67e4294c4a446d8e4a2934a921410ed7'
        )
      } catch (error) {
        expect(error.message).toEqual('not an application')
      }
    })
  })

  describe('function: convertDecodedLogs', async () => {
    let applicationLog
    let applicationListing

    beforeAll(async () => {
      applicationLog = {
        logData: {
          '0': BN('100000000000000000000'),
          '1': BN('1524147293'),
          '2': 'QmVLmoaS3peX82wgFWBo1VFodTYuM1LzzdCBNzyHWkK97R',
          deposit: BN('100000000000000000000'),
          appEndDate: BN('1524147293'),
          data: 'QmVLmoaS3peX82wgFWBo1VFodTYuM1LzzdCBNzyHWkK97R',
          listingHash:
            '0xc4dfa508fc49592be0f14ed8493c48d4e9b8af974632dea7ba61fa5dcf4d9e69',
          applicant: '0xd09cc3bc67e4294c4a446d8e4a2934a921410ed7',
          _eventName: '_Application',
        },
        txData: {
          txHash: '0x1edeec8517a7f2caa6ff9514f6904d650e25bcfada3ecf16a00814c6fa8b5354',
          blockHash: '0xf9e3dd9e37f601b78c0ce780e706517989b5e3fbc5bccd72177f834d81b90834',
          ts: '1524146993',
        },
        eventName: '_Application',
        msgSender: '0xd09cc3bc67e4294c4a446d8e4a2934a921410ed7',
      }
      applicationListing = await convertDecodedLogs([applicationLog], fromJS({}))
    })

    // i - [_Application], Map()
    // o - Map(listing)
    test('should add 1 new listing to an empty Map()', async () => {
      const logs = [applicationLog]
      const listings = fromJS({})
      const actual = await convertDecodedLogs(logs, listings)
      const expected = applicationListing
      expect(actual).toEqual(expected)
    })

    // i - [_Application, _Application], Map()
    // o - Map(listings)
    test('should add new listings to an empty Map()', async () => {})

    // i - [_Application], Map(listings)
    // o - Map(listings+app)
    test('should add 1 new listing to the Map(listings)', async () => {})

    // i - [_Application, _Application], Map(listings)
    // o - Map(listings+apps)
    test('should add new listings to the Map(listings)', async () => {})

    // i - [_Application, _Application], Map(listings)
    // o - Map(up_listings+apps)
    // case: if _Application has the same listingHash as one in Map(listings)
    test('should re-write listings or add new listings to the Map(listings)', async () => {})

    // events
    // '_Application',
    // '_Challenge',
    // '_ApplicationWhitelisted',
    // '_ApplicationRemoved',
    // '_ListingRemoved',
    // '_ListingWithdrawn',
    // '_TouchAndRemoved',
    // '_ChallengeFailed',
    // '_ChallengeSucceeded',
    // '_RewardClaimed',
    // i - [_Application, _Challenge, _PollCreated, ...], Map(listings)
    // o - Map(up_listings)
    test('should update listings or add new listings to the Map(listings)', async () => {})

    // i - [__Challenge, _PollCreated, ...], Map(listings)
    // o - Map(up_listings)
    test('should fail if inputs lack _Application event && empty Map(): ([!_Application], Map())', async () => {})
  })
})
