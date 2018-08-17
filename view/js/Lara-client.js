const steem = require("steem");
const crypto = require ('./crypto');

var LaraAccount = "lara-bot" 

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
