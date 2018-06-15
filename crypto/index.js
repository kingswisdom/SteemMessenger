var Signature = require('./steem-js/src/auth/ecc/src/signature'),
	KeyPrivate = require('./steem-js/src/auth/ecc/src/key_private'),
	PublicKey = require('./steem-js/src/auth/ecc/src/key_public'),
  hash = require('./steem-js/src/auth/ecc/src/hash'),
  base58 = require('bs58');

var Crypto = {};



Crypto.generate_session_keys = function (private_wif, public_key){
  var private_key = KeyPrivate.fromWif(private_wif);
  //var shared_secret = bs58.encode(private_key.get_shared_secret(public_key));
  var shared_secret = private_key.get_shared_secret(public_key);
  var buf = Buffer.concat([Buffer.from("Authentication key"),shared_secret]);
  return buf;
}
module.exports = Crypto;
