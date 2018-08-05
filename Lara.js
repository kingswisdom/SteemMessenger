const steem = require('steem');
const crypto = require('./assets/js/crypto');
const LaraPrivateKey = "5KbdQtvyt9pMBv37RapH8D8WmRCmGyo8e7kXsRnybqjicgu9WSp";

exports.checkLogin = function(data, out){
	console.log("server side calling crypto");
	rawContainer = steem.memo.decode(LaraPrivateKey, data.encodedmsg);
	raw = rawContainer.split("");
	raw.shift();
	raw = raw.join("");
	var decodedContainer = JSON.parse(raw);
	steem.api.getAccounts([decodedContainer.user], function(err, result){
		if(result.length > 0) {
			pubWif = result[0]["memo_key"];
			var sessionKeys = crypto.generate_session_keys(LaraPrivateKey, pubWif);
			console.log(decodedContainer.token);
			var isvalid = crypto.verify_client_authentication(decodedContainer.token, sessionKeys.authenticationKey);
			if(isvalid) {
				console.log('Lara : Connexion approved !')
				out({name: decodedContainer.user});
			}
			else {
				console.log("Lara : Someone  just tried to bypass authentication check as @" + decodedContainer.user);
				out(undefined);
			}
		}
	});
}

exports.checkIdentity = function(data, out){
	rawContainer = steem.memo.decode(LaraPrivateKey, data.message);
	raw = rawContainer.split("");
	raw.shift();
	raw = raw.join("");
	var decodedContainer = JSON.parse(raw);
	steem.api.getAccounts([decodedContainer.user], function(err, result){
		if(result.length > 0) {
			pubWif = result[0]["memo_key"];
			var sessionKeys = crypto.generate_session_keys(LaraPrivateKey, pubWif);
			console.log(decodedContainer.token);
			var isvalid = crypto.verify_client_authentication(decodedContainer.token, sessionKeys.authenticationKey);
			if(isvalid) {
				console.log('Lara : Identity confirmed ! The message will be processed securely to the recipient !')
				out({name: decodedContainer.user, to: decodedContainer.to, message: decodedContainer.message});
			}
			else {
				console.log("Lara : Someone just tried to forge a message as @"  + decodedContainer.user);
				out(undefined);
			}
		}
	});
};
