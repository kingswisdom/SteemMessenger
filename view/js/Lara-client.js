const steem = require("steem");
const libcrypto = require('@steemit/libcrypto');
const crypto = require ('./crypto');
const storage = require('./storage.js');

var LaraAccount = "lara-bot"



exports.initializeKeys = function(data, out){

    var uniqueMemoKeys 		= libcrypto.generateKeys();
    var uniquePrivate 		= uniqueMemoKeys.private;
    var uniquePublic 		= uniqueMemoKeys.public;

    steem.api.getAccounts([LaraAccount], function(err, result){
		if(result.length > 0) {
			var pubWif 		= result[0]["memo_key"];
			var sessionKeys 	= crypto.generate_session_keys(data.key, pubWif);
			var wallet 		= 	'{"user":"' 			+ data.user +
		    					 '","privateKey":"' 		+ data.key +
		    					 '","uniquePrivate":"' 		+ uniquePrivate +
		    					 '","uniquePublic":"' 		+ uniquePublic +
		    					 '","authenticationKey":"' 	+ sessionKeys.authenticationKey +
		    					 '","encryptionKey":"' 		+ sessionKeys.encryptionKey + '"}'

		    storage.createSafeStorage(wallet, data.passphrase);
		    out({user: data.user, privateKey: data.key, uniquePrivate: uniquePrivate, uniquePublic: uniquePublic, authenticationKey: sessionKeys.authenticationKey, encryptionKey: sessionKeys.encryptionKey });
		}
	});
}

exports.decodeSafeSocket = function(data, key, keys, out){
	console.log(data, key)

	var rawContainer 	= crypto.decrypt(keys.encryptionKey, data.encodedmsg);
	var raw 		= rawContainer.split("");
	raw.shift();
	raw 			= raw.join("");
  try {
    var decodedContainer = JSON.parse(raw);
  } catch (e) {
    console.error("decodeSafeSocket decryption Parsing error:", e);
    out(undefined);
    return;
  }

	console.log(decodedContainer);
	console.log(decodedContainer.token);
	console.log(keys.authenticationKey);

	var isvalid = crypto.verify_client_authentication(decodedContainer.token, keys.authenticationKey);
	if(isvalid) {
		out(decodedContainer);
	}
	else {
		out(undefined);
	}
}

exports.encodeSafeSocket = function(data, key, keys, out){
	steem.api.getAccounts([LaraAccount], function(err, result){
		if(result.length > 0) {
			var pubWif 		= result[0]["memo_key"];
            		data.token 		= crypto.authentication_token(keys.authenticationKey);
            		var Container 		= "#" + JSON.stringify(data);
            		var encodedContainer 	= crypto.encrypt(keys.encryptionKey, Container);
            		out({encodedmsg: encodedContainer});
		}
	});
}

exports.encodeMessage = function(data, out){
	var preOp 	= "#" + data.message;
	var encoded 	= crypto.encrypt(data.sharedKey, preOp);
  	console.log("encrypted message" + encoded);
	out({encoded: encoded})
}


exports.decodeMessage = function(data, out){
	var pubWif 		= data.recipient_pubWIF;
	var sessionKeys 	= crypto.generate_session_keys(data.key,pubWif);
	var decoded 		= crypto.decrypt(sessionKeys.encryptionKey, data.message);
	var decodedFinal 	= decoded.split("");
  	decodedFinal.shift();
  	var decodedFinal 	= decodedFinal.join("");
    console.log("decoded message"+decodedFinal);
  	out({decoded: decodedFinal});

}

exports.decodeMessage2 = function(data, out){
	var decoded 		= crypto.decrypt(data.sharedKey, data.message);
	var decodedFinal 	= decoded.split("");
	decodedFinal.shift();
	var decodedFinal 	= decodedFinal.join("");
    console.log("decoded message"+decodedFinal);
  	out({decoded: decodedFinal});

}
