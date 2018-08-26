var CryptoJS = require("crypto-js");
var scrypt = require('scryptsy');
const secureRandom = require('secure-random');

//TODO: check the encoding of encryptedWallet. 
exports.createSafeStorage = function(data, passphrase){
	var JSON_data = JSON.parse(data);
	var user = JSON_data.user;
	generateSalt({user:user}, function(out){
		var params = {salt: out.salt, N: 65536, r: 8, p: 1, keyLen: 44};
		var kdfResult = scrypt(passphrase, params.salt, params.N, params.r, params.p, params.keyLen)
		var encryptedWallet = CryptoJS.AES.encrypt(data, kdfResult.toString('hex')).toString();
		var wallet = '{"encryptedWallet": "'+encryptedWallet+'", "params": {"salt":"'+params.salt.toString('hex')+'", "N":'+params.N+', "r":'+params.r+', "p":'+params.p+', "keyLen":'+params.keyLen+'}}'
		localStorage.setItem(user, wallet);
		console.log(localStorage)
	});

}

exports.readSafeStorage = function(data, out){
	var wallet = localStorage.getItem(data.user);
	try{
		var ope = JSON.parse(wallet);
		var params = ope.params;
		var salt = Buffer.from(params.salt, 'hex');
		console.log(ope)
		var kdfResult = scrypt(data.passphrase, salt, params.N, params.r, params.p, params.keyLen)
		var decryptedWallet = CryptoJS.AES.decrypt(ope.encryptedWallet, kdfResult.toString('hex')).toString(CryptoJS.enc.Utf8);
		var JSON_wallet = JSON.parse(decryptedWallet);
		out(JSON_wallet);
	}
	catch(err) {
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
// return a buffer because pbkdf2sync used in scrypt can handle buffers
function generateSalt(data, out){
	var randBuffer = secureRandom.randomBuffer(32);
	var userBuffer = Buffer.from(data.user);
	var salt = Buffer.concat([randBuffer,userBuffer], userBuffer.length + randBuffer.length)
	out({salt: salt});
}
