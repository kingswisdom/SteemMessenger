const steem = require("steem");
const libcrypto = require('@steemit/libcrypto');
const crypto = require ('./crypto');


exports.SafeSocket = function(data, out){
	var sessionKeys = crypto.generate_session_keys(data.key, data.LaraPublicKey);
    var authenticationToken = crypto.authentication_token(sessionKeys.authenticationKey);
    var Container = "#" + JSON.stringify({user: data.user, to: data.receiver, token: authenticationToken, message: encoded});
    var encodedContainer = steem.memo.encode(privateMemoKey, LaraPublicKey, Container);
}