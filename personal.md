Sign a piece of data w/ private key

```js
var ethUtil = require(‘ethereumjs-util’);

// Elliptic curve signature must be done on the Keccak256 Sha3 hash of a piece of data.
var data = 'i am a string';
var message = ethUtil.toBuffer(data);
var msgHash = ethUtil.hashPersonalMessage(message);

// sign msg hash w/ private key
var sig = ethUtil.ecsign(msgHash, privateKey);
// serialize it
var serialized = ethUtil.bufferToHex(this.concatSig(sig.v, sig.r, sig.s))
```

On the server, receive (1) digital signature, (2) address

```js
var sig = req.sig
var owner = req.owner

// Same data as before
var data = 'i am a string'
var message = ethUtil.toBuffer(data)
var msgHash = ethUtil.hashPersonalMessage(message)

// Get the address of whoever signed this message
var signature = ethUtil.toBuffer(sig)
// unpack signature
var sigParams = ethUtil.fromRpcSig(signature)
// get public key
var publicKey = ethUtil.ecrecover(msgHash, sigParams.v, sigParams.r, sigParams.s)
// get address
var sender = ethUtil.publicToAddress(publicKey)
var addr = ethUtil.bufferToHex(sender)

// Determine if it is the same address as 'owner'
if (addr == owner) {
  // If the signature matches the owner supplied, create a
  // JSON web token for the owner that expires in 24 hours.
  var token = jwt.sign({ user: req.body.addr }, 'i am another string', {
    expiresIn: '1d',
  })

  res.send(200, { success: 1, token: token })
} else {
  // If the signature doesn’t match, error out
  res.send(500, { err: 'Signature did not match.' })
}
```

Ethjs

```js
ethjsPersonalSignButton.addEventListener('click', function(event) {
  event.preventDefault()
  var text = terms
  var msg = ethUtil.bufferToHex(new Buffer(text, 'utf8'))
  var from = web3.eth.accounts[0]

  console.log('CLICKED, SENDING PERSONAL SIGN REQ')
  var params = [from, msg]

  // Now with Eth.js
  var eth = new Eth(web3.currentProvider)

  eth
    .personal_sign(msg, from)
    .then(signed => {
      console.log('Signed!  Result is: ', signed)
      console.log('Recovering...')

      return eth.personal_ecRecover(msg, signed)
    })
    .then(recovered => {
      if (recovered === from) {
        console.log('Ethjs recovered the message signer!')
      } else {
        console.log('Ethjs failed to recover the message signer!')
        console.dir({ recovered })
      }
    })
})
```

```js
// bip39
// It consists of two parts: generating the mnemonic, and converting it into a binary seed.
// A user may decide to protect their mnemonic with a passphrase. If a passphrase is not present, an empty string "" is used instead.
```

```js
// Encrypted comms
// ALICE
// message + bobAddress -> ENCRYPT_FUNCTION -> cyphertext
//
// cyphertext + bobPrivateKey -> DECRYPT_FUNCTION -> message
// BOB

// Authenticated and encrypted comms
// ALICE
// message + alicePrivateKey + bobAddress -> ENCRYPT_FUNCTION -> cyphertext
//
// cyphertext + bobPrivateKey + aliceAddress -> DECRYPT_FUNCTION -> message
// BOB

// Authentication
// ALICE
// message + alicePrivateKey -> ENCRYPT_FUNCTION -> digital sig
//
// digital sig + aliceAddress -> DECRYPT_FUNCTION -> message
// SERVER

// Personal signature recovery
// ALICE
// plainText + alicePrivateKey (+ alicePublicKey) -> ENCRYPT_FUNCTION -> cyphertext
//
// plainText + cyphertext -> DECRYPT_FUNCTION -> recovered -> (recovered === alicePublicKey) ?
// ALICE
```

// Personal signature recovery
// ALICE
// plainText + alicePrivateKey (+ alicePublicKey) -> ENCRYPT_FUNCTION -> cyphertext
//
// plainText + cyphertext -> DECRYPT_FUNCTION -> recovered -> (recovered === alicePublicKey) ?
// ALICE

// use case: legal agreements
// Once the user signs it, the site could store that signature, and later on they could use it to prove that the user signed the message.
// This means a user doesn’t need to hold any ether to perform a meaningful act with their MetaMask accounts.

// In the past, when a website would check the current accounts via web3.eth.accounts,
// the site only really knew that the user intended to appear as that account, but
// with a simple signature challenge, you can prove they really do control that account.
// From there, you could give them a browser cookie to stay logged in.
// That’s account management without any external, third-party services like Facebook Connect or Google tracking your every move.
