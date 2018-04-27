import { updateListings, createListing } from '../utils'
import * as actions from '../actions'
import { BN } from 'redux/libs/units'
import { fromJS } from 'immutable'
import helpers from './helpers'

const simpleHashes = [
  '0x0000000000000000000000000000000000000000000000000000000000000000',
  '0x0000000000000000000000000000000000000000000000000000000000000001',
  '0x0000000000000000000000000000000000000000000000000000000000000002',
  '0x0000000000000000000000000000000000000000000000000000000000000003',
  '0x0000000000000000000000000000000000000000000000000000000000000004',
  '0x0000000000000000000000000000000000000000000000000000000000000005',
  '0x0000000000000000000000000000000000000000000000000000000000000006',
  '0x0000000000000000000000000000000000000000000000000000000000000007',
  '0x0000000000000000000000000000000000000000000000000000000000000008',
  '0x0000000000000000000000000000000000000000000000000000000000000009',
]

describe('listings utils', async () => {
  describe('function: createListing', async () => {
    test.skip('should correctly convert an _Application log -> listing entity', async () => {
      const logData = {
        applicant: '0xd09cc3bc67e4294c4a446d8e4a2934a921410ed7',
        appEndDate: BN('1534147293'),
        data: 'QmVLmoaS3peX82wgFWBo1VFodTYuM1LzzdCBNzyHWkK97R',
        deposit: BN('100000000000000000000'),
        listingHash: '0xc4dfa508fc49592be0f14ed8493c48d4e9b8af974632dea7ba61fa5dcf4d9e69',
        _eventName: '_Application',
      }
      const txData = {
        txHash: '0x1edeec8517a7f2caa6ff9514f6904d650e25bcfada3ecf16a00814c6fa8b5354',
        blockHash: '0xf9e3dd9e37f601b78c0ce780e706517989b5e3fbc5bccd72177f834d81b90834',
        ts: BN('1534146993'),
      }
      const actual = await createListing(
        logData,
        txData,
        '0xd09cc3bc67e4294c4a446d8e4a2934a921410ed7'
      )
      const expected = helpers.createDefaultListing({})
      expect(actual).toEqual(expected)
    })

    test('should throw an error if given a log other than _Application', async () => {
      try {
        const logData = {
          applicant: '0xd09cc3bc67e4294c4a446d8e4a2934a921410ed7',
          appEndDate: BN('1534147293'),
          data: 'QmVLmoaS3peX82wgFWBo1VFodTYuM1LzzdCBNzyHWkK97R',
          deposit: BN('100000000000000000000'),
          listingHash:
            '0xc4dfa508fc49592be0f14ed8493c48d4e9b8af974632dea7ba61fa5dcf4d9e69',
          _eventName: '_Challenge',
        }
        const txData = {
          txHash: '0x1edeec8517a7f2caa6ff9514f6904d650e25bcfada3ecf16a00814c6fa8b5354',
          blockHash: '0xf9e3dd9e37f601b78c0ce780e706517989b5e3fbc5bccd72177f834d81b90834',
          ts: BN('1534146993'),
        }
        const actual = await createListing(
          logData,
          txData,
          '0xd09cc3bc67e4294c4a446d8e4a2934a921410ed7'
        )
      } catch (error) {
        expect(error.message).toEqual('not an application')
      }
    })
  })

  describe('function: updateListings', async () => {
    describe('_Application logs', async () => {
      // i - [_Application], Map()
      // o - Map(listing)
      test('should add 1 new listing to an empty Map()', async () => {
        const listing = helpers.createDefaultListing({})
        const actual = await updateListings([listing], fromJS({}))
        const expected = fromJS({
          '0xc4dfa508fc49592be0f14ed8493c48d4e9b8af974632dea7ba61fa5dcf4d9e69': listing,
        })
        expect(actual).toEqual(expected)
      })

      // i - [_Application, _Application], Map()
      // o - Map(listings)
      test('should add new listings to an empty Map()', async () => {
        const a = helpers.createDefaultListing({})
        const b = helpers.createDefaultListing({
          listingHash: simpleHashes[1],
        })
        const actual = await updateListings([a, b], fromJS({}))
        const expected = fromJS({ [a.listingHash]: a, [b.listingHash]: b })
        expect(actual).toEqual(expected)
      })

      // i - [_Application], Map(listings)
      // o - Map(listings+app)
      test('should add 1 new listing to a Map(listings)', async () => {
        const a = helpers.createDefaultListing({})
        const b = helpers.createDefaultListing({
          listingHash: simpleHashes[1],
        })
        const c = helpers.createDefaultListing({
          listingHash: simpleHashes[2],
        })
        // create a Map({ a, b })
        const aMap = await updateListings([a, b], fromJS({}))
        const actual = await updateListings([c], aMap)
        const expected = fromJS({
          [a.listingHash]: a,
          [simpleHashes[1]]: b,
          [simpleHashes[2]]: c,
        })
        expect(actual).toEqual(expected)
      })

      // i - [_Application, _Application], Map(listings)
      // o - Map(listings+apps)
      test('should add new listings to the Map(listings)', async () => {
        const a = helpers.createDefaultListing({})
        const b = helpers.createDefaultListing({
          listingHash: simpleHashes[1],
        })
        const c = helpers.createDefaultListing({
          listingHash: simpleHashes[2],
        })
        const d = helpers.createDefaultListing({
          listingHash: simpleHashes[3],
        })
        // create a Map({ a, b })
        const aMap = await updateListings([a, b], fromJS({}))
        const actual = await updateListings([c, d], aMap)
        const expected = fromJS({
          [a.listingHash]: a,
          [simpleHashes[1]]: b,
          [simpleHashes[2]]: c,
          [simpleHashes[3]]: d,
        })
        expect(actual).toEqual(expected)
      })
      // i - [_Application, _Application], Map(listings)
      // o - Map(up_listings+apps)
      // case: if _Application has the same listingHash as one in Map(listings)
      test('should re-write listings if newer or add new listings to the Map(listings)', async () => {
        const hashes = simpleHashes.slice(0, 2)
        const [a, b] = hashes.map(h => helpers.createDefaultListing({ listingHash: h }))
        const c = helpers.createDefaultListing({
          listingHash: simpleHashes[1],
          status: '2',
          ts: '2534826979',
        })
        const d = helpers.createDefaultListing({
          listingHash: simpleHashes[2],
          status: '3',
        })
        const e = helpers.createDefaultListing({
          listingHash: simpleHashes[0],
          ts: '9534896979',
          status: '3',
        })
        // create a Map({ a, b })
        const aMap = await updateListings([a, b], fromJS({}))
        const actual = await updateListings([c, d, e], aMap)
        const expected = fromJS({
          // [simpleHashes[0]]: a,
          [simpleHashes[0]]: e,
          // [simpleHashes[1]]: b,
          [simpleHashes[1]]: c,
          [simpleHashes[2]]: d,
        })
        expect(actual).toEqual(expected)
      })
    })

    describe('Bad inputs', async () => {
      test('should fail if input == _Application log w/o a listingHash', async () => {
        const hashes = simpleHashes.slice(0, 2)
        const [a, b] = hashes.map(h => helpers.createDefaultListing({ listingHash: h }))
        // create a Map({ a, b })
        const aMap = await updateListings([a, b], fromJS({}))

        // create bad _Application
        const d = helpers.createDefaultListing({
          listingHash: false,
        })

        const actual = await updateListings([d], aMap)
        const expected = fromJS({
          [simpleHashes[0]]: a,
          [simpleHashes[1]]: b,
        })
        expect(actual).toEqual(expected)
      })

      test('should fail if input == _Challenge log', async () => {
        const hashes = simpleHashes.slice(0, 2)
        const [a, b] = hashes.map(h => helpers.createDefaultListing({ listingHash: h }))
        // create a Map({ a, b })
        const aMap = await updateListings([a, b], fromJS({}))

        // create _Challenge
        const c = helpers.createChallengeLog({})

        const actual = await updateListings([c], aMap)
        const expected = fromJS({
          [simpleHashes[0]]: a,
          [simpleHashes[1]]: b,
        })
        expect(actual).toEqual(expected)
      })
    })
  })
})

// The problem with your method is that if the promise resolves then the test will pass even though you expect it to reject.
// The test should fail if the promise resolves. It should only pass if it rejects with the exact error that you expected.
