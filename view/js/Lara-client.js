const steem = require("steem");
const libcrypto = require('@steemit/libcrypto');
const crypto = require ('./crypto');
const storage = require('./storage.js');

var LaraAccount = "lara-bot"



exports.initializeKeys = function(data, out){
    var uniqueMemoKeys = libcrypto.generateKeys();
    var uniquePrivate = uniqueMemoKeys.private;
    var uniquePublic = uniqueMemoKeys.public;
    steem.api.getAccounts([LaraAccount], function(err, result){
		if(result.length > 0) {
			pubWif = result[0]["memo_key"];
			var sessionKeys = crypto.generate_session_keys(data.key, pubWif);
		    var wallet = '{"user":"' + data.user + '","privateKey":"' + data.key + '","uniquePrivate":"' + uniquePrivate + '","uniquePublic":"' + uniquePublic + '","authenticationKey":"' + sessionKeys.authenticationKey + '","encryptionKey":"' + sessionKeys.encryptionKey + '"}'
		    storage.createSafeStorage(wallet, data.passphrase);
		    out({user: data.user, privateKey: data.key, uniquePrivate: uniquePrivate, uniquePublic: uniquePublic, authenticationKey: sessionKeys.authenticationKey, encryptionKey: sessionKeys.encryptionKey });
		}
	});
    }

exports.decodeSafeSocket = function(data, key, out){
	console.log(data, key)
	rawContainer = steem.memo.decode(key, data.encodedmsg);
	raw = rawContainer.split("");
	raw.shift();
	raw = raw.join("");
	var decodedContainer = JSON.parse(raw);
	console.log(decodedContainer)
	steem.api.getAccounts([LaraAccount], function(err, result){
		if(result.length > 0) {
			pubWif = result[0]["memo_key"];
			var sessionKeys = crypto.generate_session_keys(key, pubWif);
			console.log(decodedContainer.token);
			var isvalid = crypto.verify_client_authentication(decodedContainer.token, sessionKeys.authenticationKey);
			if(isvalid) {
				out(decodedContainer);
			}
			else {
				out(undefined);
			}
		}
	});
}

exports.encodeSafeSocket = function(data, key, out){
	steem.api.getAccounts([LaraAccount], function(err, result){
		if(result.length > 0) {
			var pubWif = result[0]["memo_key"];
			var sessionKeys = crypto.generate_session_keys(key, pubWif);
            data.token = crypto.authentication_token(sessionKeys.authenticationKey);
            var Container = "#" + JSON.stringify(data);
            var encodedContainer = steem.memo.encode(key, pubWif, Container);
            out({encodedmsg: encodedContainer});
		}
	});
}

exports.encodeMessage = function(data, out){
	var preOp = "#" + data.message;
	var encoded = crypto.encrypt(data.sharedKey, preOp);
  console.log("encrypted message" + encoded);
	out({encoded: encoded})
}

//TODO test encode+decodeMess
exports.decodeMessage = function(data, out){
  steem.api.getAccounts([data.receiver], function(err, result) {
    var pubWif = result[0]["memo_key"];
    var sessionKeys = crypto.generate_session_keys(data.key,pubWif);
    var decoded = crypto.decrypt(sessionKeys.encryptionKey, data.message);
  	var decodedFinal = decoded.split("");
  	decodedFinal.shift();
  	var decodedFinal = decodedFinal.join("");
    console.log("decoded message"+decodedFinal);
  	out({decoded: decodedFinal});
  });

}
