var Signature = require('./steem-js/auth/ecc/src/signature'),
	KeyPrivate = require('./steem-js/auth/ecc/src/key_private'),
	PublicKey = require('./steem-js/auth/ecc/src/key_public'),
  hash = require('./steem-js/auth/ecc/src/hash'),
  base58 = require('bs58'),
	sjcl = require('./sjcl/sjcl.js');

var Crypto = {};



Crypto.generate_session_keys = function (private_wif, public_key){
	//console.log(private_wif);
  var private_key = KeyPrivate.fromWif(private_wif);
  var shared_secret = private_key.get_shared_secret(public_key);
	//console.log(base58.encode(shared_secret));
	var authenticationKey = base58.encode(hash.HmacSHA256(shared_secret,"Authentication key"));
	//TODO change message encryption from steem.auth.memo to AES-GCM
	var encryptionKey = base58.encode(hash.HmacSHA256(shared_secret,"Encryption key"));
	//console.log(authenticationKey);
	//console.log(encryptionKey);
	//console.log("end crypto func");
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

// TODO look at z85 for file encryption
// TODO do we want to use the extra data or what?
/**

 * Encryption using AES-GCM. The choices were CCM, GCM, and OCB2. I need to check the other 2.

 * @param {string} encryptionKey A base64url encoded symmetric key

 * @param {string} data base64url string. Make sure that data is a printable string.

 * @return {string} The flat json ciphertext.

 */
Crypto.encrypt = function (encryptionKey,data){
	try{
		var rawEncryptionKey = sjcl.codec.base64url.toBits(encryptionKey);
		var ciphertext = sjcl.encrypt(rawEncryptionKey, data, {mode : "gcm"});
		var rawct = sjcl.json.decode(ciphertext);
		var rawOutput = {iv:sjcl.codec.base64url.fromBits(rawct.iv),
			mode : "gcm", cipher :"aes",
			ct:sjcl.codec.base64url.fromBits(rawct.ct)};
		var output = sjcl.json.encode(rawOutput);
		return output;

	}catch(err) {//should happen only if the encryption key is not base64url
	 	return err;
	}
}

/**

 * Decryption of AES-GCM.

 * @param {string} decryptionKey A base64url encoded symmetric key. Error if it is not the right key

 * @param {string} data base64url string. Make sure that data is a printable string.

 * @return {string} The flat json ciphertext.

 */
Crypto.decrypt = function(decryptionKey,data){
	try{
		var rawDecryptionKey = sjcl.codec.base64url.toBits(decryptionKey);
		//convert base64url to base64
		data = data.replace(/-/g,'+').replace(/_/g,'/')
		var plaintext = sjcl.decrypt(rawDecryptionKey, data);
		return plaintext;
	}catch(err) {
		//either the raw dercyption key is not base64url
		//either the decryption fail: which is because
			//the decryption key is not the good one
			//or/and the authentication tag is wrong
		return err;
	}
}

Crypto.bufferToBase64url  = function(buf){
	//strangelly I did not find another way to properly turn
	// scrypt Buffer output into a base64url that work with sjcl
	return sjcl.codec.base64url.fromBits(
		sjcl.codec.hex.toBits(buf.toString('hex'))
	)
}
module.exports = Crypto;
