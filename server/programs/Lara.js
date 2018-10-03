const steem 		= require('steem');
const crypto 		= require('../../view/js/crypto');
const db 		= require('./db.js')
const config 		= require('../../config.json');

const LaraPrivateKey 	= config.LaraKeys.Memo.Private;

exports.checkLogin = function(data, out){
	console.log(data.encodedmsg.length);
	if(data.encodedmsg.length < 1000){ //This is a protection to avoid stunning Lara with a malicious heavy encodedmsg, and thus, slowing the server.
		var rawContainer 	= steem.memo.decode(LaraPrivateKey, data.encodedmsg);
		var raw 		= rawContainer.split("");
		raw.shift();
		raw 			= raw.join("");

		try { //Check if decryption gives a JSON
			var decodedContainer = JSON.parse(raw);
		} catch (e) {
			console.error("Parsing error:", e);
			out(undefined);
			return;
		}

		steem.api.getAccounts([decodedContainer.user], function(err, result){
			if(result.length > 0) {
				pubWif = result[0]["memo_key"];
				db.checkIfLeakedKey({key: pubWif}, function(res){
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
						out({user: decodedContainer.user, error: "leaked"});
					}
				});

			}
		})
	}
	else{
		console.log("Overflow attack avoided!");
	}
	
}


exports.checkIdentity = function(data, out){
	console.log(data.encodedmsg.length);
	if(data.encodedmsg.length < 1000){ //This is a protection to avoid stunning Lara with a malicious heavy encodedmsg, and thus, slowing the server.

		var rawContainer 	= steem.memo.decode(LaraPrivateKey, data.message);
		var raw 		= rawContainer.split("");
		raw.shift();
		raw 			= raw.join("");
		try {
			var decodedContainer = JSON.parse(raw);
		} catch (e) {
			console.error("Parsing error:", e);
			out(undefined);
			return;
		}
		steem.api.getAccounts([decodedContainer.user], function(err, result){
			if(result.length > 0) {
				db.checkSubscription({user: decodedContainer.user}, function(res){
					console.log(decodedContainer.user)
					if(res.length > 0 && res[0].user != undefined && res[0].end >= Date.now()){
						var pubWif = result[0]["memo_key"];
						checkIfLeaked(pubWif, function(output){
							if(output == "not leaked"){
								var sessionKeys 	= crypto.generate_session_keys(LaraPrivateKey, pubWif);
								var isvalid 		= crypto.verify_client_authentication(decodedContainer.token, sessionKeys.authenticationKey);
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
								out({user: decodedContainer.user, error: "leaked"});
							}
						});
						
					}
					else{
						out({error: "not subscribed"});
					}
				});
			}
		});
	}
	else{
		console.log("Overflow attack avoided!");
	}
};

//TODO optimise the Steem API calls and DH computation
//TODO benchamrk nodejs crypto speed
exports.decodeSafeSocket = function(data, username, out){

	steem.api.getAccounts([username], function(err, result){
		if(result.length > 0) {
			var pubWif = result[0]["memo_key"];
			checkIfLeaked(pubWif, function(output){
				if(output == "not leaked"){
					var sessionKeys 	= crypto.generate_session_keys(LaraPrivateKey, pubWif);
					var rawContainer 	= crypto.decrypt(sessionKeys.encryptionKey, data.encodedmsg);
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
				else{
					out({user: username, error: "leaked"});
				}
			});
		}
	});
}

exports.encodeSafeSocket = function(data, out){
	steem.api.getAccounts([data.identity], function(err, result){
		if(result.length > 0) {
			var pubWif 		= result[0]["memo_key"];
			var sessionKeys 	= crypto.generate_session_keys(LaraPrivateKey, pubWif);
            		data.token 		= crypto.authentication_token(sessionKeys.authenticationKey);
            		var Container 		= "#" + JSON.stringify(data);
            		var encodedContainer 	= crypto.encrypt(sessionKeys.encryptionKey, Container);
            		out({encodedmsg: encodedContainer});
		}
	});
}

function checkIfLeaked(key, out){
	db.checkIfLeakedKey({key: key}, function(res){
		if(res == "not leaked"){
			out(res)
		}
		else{
			out("leaked");
		}
	});
}