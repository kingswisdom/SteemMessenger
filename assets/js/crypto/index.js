var Signature = require('./steem-js/src/auth/ecc/src/signature'),
	KeyPrivate = require('./steem-js/src/auth/ecc/src/key_private'),
	PublicKey = require('./steem-js/src/auth/ecc/src/key_public'),
  hash = require('./steem-js/src/auth/ecc/src/hash'),
  base58 = require('bs58');

var Crypto = {};



Crypto.generate_session_keys = function (private_wif, public_key){
  var private_key = KeyPrivate.fromWif(private_wif);
  var shared_secret = private_key.get_shared_secret(public_key);
	var authenticationKey = base58.encode(hash.HmacSHA256(shared_secret,"Authentication key"));
	//TODO change message encryption from steem.auth.memo to AES-GCM
	var encryptionKey = base58.encode(hash.HmacSHA256(shared_secret,"Encryption key"));
	console.log("end crypto func");
  return {"authenticationKey": authenticationKey, "encryptionKey": encryptionKey};
};

Crypto.authentication_token = function (authenticationKey){
//TODO derive a session token from authenticationKey and date/hour or smth else
	return authenticationKey;
}
Crypto.verify_client_authentication = function (receivedtoken, authenticationKey){
	//TODO modify this when previous function is modified
	var computedToken = this.authentication_token(authenticationKey);
	return (computedToken == receivedtoken);
}

module.exports = Crypto;
