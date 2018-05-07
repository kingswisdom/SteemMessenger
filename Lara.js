const steem = require('steem');
const LaraPrivateKey = "";

exports.checkLogin = function(data, out){
	rawContainer = steem.memo.decode(LaraPrivateKey, data.encodedmsg);
	raw = rawContainer.split("");
	raw.shift();
	raw = raw.join("");
	var decodedContainer = JSON.parse(raw);
	steem.api.getAccounts([decodedContainer.user], function(err, result){
		if(result.length > 0) {
			pubWif = result[0]["memo_key"];
			var isvalid = steem.auth.wifIsValid(decodedContainer.key, pubWif);
			if(isvalid == true) {
				console.log('Lara : Connexion approved !')
				out({name: decodedContainer.user});
			}
			else {
				console.log("Lara : @" + decodedContainer.user + " just tried to bypass auth check. Here's more informations on this attempt :\n" 
						  + "      PublicKey : " + pubWif + "\n" 
						  + "      PrivateKey : " + decodedContainer.key);
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
			var isvalid = steem.auth.wifIsValid(decodedContainer.key, pubWif);
			if(isvalid == true) {
				console.log('Lara : Identity confirmed ! The message will be processed securely to the recipient !')
				out({name: decodedContainer.user, to: decodedContainer.to, message: decodedContainer.message});
			}
			else {
				console.log("Lara : @" + decodedContainer.user + " just tried to forge a message. Here's more informations on this attempt :\n" 
						  + "      victim : " + decodedContainer.to + "\n" 
						  + "      PublicKey : " + pubWif + "\n" 
						  + "      PrivateKey : " + decodedContainer.key);
				out(undefined);
			}
		}
	});
};
