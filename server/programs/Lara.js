const steem = require('steem');
const crypto = require('../../view/js/crypto');
const db = require('./db.js')
const config = require('../../config.json');

const LaraPrivateKey = config.LaraKeys.Memo.Private;

exports.checkLogin = function(data, out){
	rawContainer = steem.memo.decode(LaraPrivateKey, data.encodedmsg);
	raw = rawContainer.split("");
	raw.shift();
	raw = raw.join("");
	//Check if decryption gives a JSON
	try {
		var decodedContainer = JSON.parse(raw);
	} catch (e) {
		console.error("Parsing error:", e);
		out(undefined);
	}
	steem.api.getAccounts([decodedContainer.user], function(err, result){
		if(result.length > 0) {
			pubWif = result[0]["memo_key"];
			db.checkIfLeakedKey({user: decodedContainer.user}, function(res){
				if(res == "not leaked"){
					var sessionKeys = crypto.generate_session_keys(LaraPrivateKey, pubWif);
					console.log("authentication token");
					console.log(decodedContainer.token);
					var isvalid = crypto.verify_client_authentication(decodedContainer.token, sessionKeys.authenticationKey);
						if(isvalid) {
							console.log('Lara : Connexion approved !')
							out({user: decodedContainer.user});
						}
						else {
							console.log("Lara : Someone  just tried to bypass authentication check as @" + decodedContainer.user);
							out(undefined);
						}
				}
				else{
					var isvalid = steem.auth.wifIsValid(res.privWif, pubWif);
					if(isvalid == true){
						out({user: decodedContainer.user, error: "leaked"});
					}
					if (isvalid == false) {
						//TODO delete user from leaked keys db
						var sessionKeys = crypto.generate_session_keys(LaraPrivateKey, pubWif);
						console.log(decodedContainer.token);
						var isvalid = crypto.verify_client_authentication(decodedContainer.token, sessionKeys.authenticationKey);
						if(isvalid) {
							console.log('Lara : Connexion approved !')
							out({user: decodedContainer.user});
						}
						else {
							console.log("Lara : Someone  just tried to bypass authentication check as @" + decodedContainer.user);
							out(undefined);
						}
					}
				}
			});

		}
	})
}


exports.checkIdentity = function(data, out){
	rawContainer = steem.memo.decode(LaraPrivateKey, data.message);
	raw = rawContainer.split("");
	raw.shift();
	raw = raw.join("");
	var decodedContainer = JSON.parse(raw);
	steem.api.getAccounts([decodedContainer.user], function(err, result){
		if(result.length > 0) {
			db.checkSubscription({user: decodedContainer.user}, function(res){
				console.log(decodedContainer.user)
				if(res.length > 0 && res[0].user != undefined && res[0].end >= Date.now()){
					pubWif = result[0]["memo_key"];
					var sessionKeys = crypto.generate_session_keys(LaraPrivateKey, pubWif);
					console.log(decodedContainer.token);
					var isvalid = crypto.verify_client_authentication(decodedContainer.token, sessionKeys.authenticationKey);
					if(isvalid) {
						console.log('Lara : Identity confirmed ! The message will be processed securely to the recipient !')
						out({user: decodedContainer.user, to: decodedContainer.to, message: decodedContainer.message});
					}
					else {
						console.log("Lara : Someone just tried to forge a message as @"  + decodedContainer.user);
						out(undefined);
					}
				}
				else{
					out({error: "not subscribed"});
				}
			});
		}
	});
};

exports.decodeSafeSocket = function(data, username, out){
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
				console.log('Lara : Identity confirmed ! The request will be processed securely to the recipient !')
				out(decodedContainer);
			}
			else {
				console.log("Lara : Someone just tried to forge a request as @"  + decodedContainer.user);
				out(undefined);
			}
		}
	});
}

exports.encodeSafeSocket = function(data, out){
	steem.api.getAccounts([data.identity], function(err, result){
		if(result.length > 0) {
			var pubWif = result[0]["memo_key"];
			var sessionKeys = crypto.generate_session_keys(LaraPrivateKey, pubWif);
            data.token = crypto.authentication_token(sessionKeys.authenticationKey);
            var Container = "#" + JSON.stringify(data);
            var encodedContainer = steem.memo.encode(LaraPrivateKey, pubWif, Container);
            out({encodedmsg: encodedContainer});
		}
	});
}
