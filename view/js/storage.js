const crypto = require ('./crypto');
var scrypt = require('scryptsy');
const secureRandom = require('secure-random');

exports.createSafeStorage = function(data, passphrase){
	var JSON_data = JSON.parse(data);
	var user = JSON_data.user;
	generateSalt({user:user}, function(out){
		var params = {salt: out.salt, N: 65536, r: 8, p: 1, keyLen: 32};
		var kdfResult = scrypt(passphrase, params.salt, params.N, params.r, params.p, params.keyLen)
		var kdfBase64 = crypto.bufferToBase64url(kdfResult);
		var encryptedWallet = crypto.encrypt(kdfBase64, data);
		var wallet = '{"encryptedWallet": '+encryptedWallet+', "params": {"salt":"'+params.salt.toString('hex')+'", "N":'+params.N+', "r":'+params.r+', "p":'+params.p+', "keyLen":'+params.keyLen+'}}'
		localStorage.setItem(user, wallet);
		console.log("localStorage:");
		console.log(localStorage)
	});

}

exports.readSafeStorage = function(data, out){
	var wallet = localStorage.getItem(data.user);
	try{
		var ope = JSON.parse(wallet);
		var params = ope.params;
		var salt = Buffer.from(params.salt, 'hex');
		var kdfResult = scrypt(data.passphrase, salt, params.N, params.r, params.p, params.keyLen)
		var kdfBase64 = crypto.bufferToBase64url(kdfResult);
		var decryptedWallet = crypto.decrypt(kdfBase64, JSON.stringify(ope.encryptedWallet));
		var JSON_wallet = JSON.parse(decryptedWallet);
		out(JSON_wallet);
	}
	catch(err) {
				console.log(err);
    		out(err);
	}

}

exports.updateSafeStorage = function(data, passphrase){
	// previous version was insecured because the salt was the same between updates
	// Question: do we actually need to removeitem? Check how storage value are updated.
	// TODO: check where it serves us best to put the wallet
	localStorage.removeItem(user);
	createSafeStorage(data,passphrase);
}

exports.deleteSafeStorage = function(data, passphrase){
	var JSON_data = JSON.parse(data);
	var user = JSON_data.user;
 	localStorage.removeItem(user);
}

//TODO use sjcl random number generation
// return a buffer because pbkdf2sync used in scrypt can handle buffers
function generateSalt(data, out){
	var randBuffer = secureRandom.randomBuffer(32);
	var userBuffer = Buffer.from(data.user);
	var salt = Buffer.concat([randBuffer,userBuffer], userBuffer.length + randBuffer.length)
	out({salt: salt});
}
