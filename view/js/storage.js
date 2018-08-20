var CryptoJS = require("crypto-js");
var scrypt = require('scryptsy');

exports.createSafeStorage = function(data, passphrase){
	var JSON_data = JSON.parse(data);
	var user = JSON_data.user;
	generateSalt({user:user}, function(out){
		var salt = out.salt;
		var params = {salt: salt, N: 65536, r: 8, p: 2, keyLen: 64};
		var kdfResult = scrypt(passphrase, salt, params.N, params.r, params.p, params.keyLen)
		var encryptedWallet = CryptoJS.AES.encrypt(data, kdfResult.toString('hex')).toString();
		var wallet = '{"encryptedWallet": "'+encryptedWallet+'", "params": {"salt":"'+params.salt+'", "N":'+params.N+', "r":'+params.r+', "p":'+params.p+', "keyLen":'+params.keyLen+'}}'
		localStorage.setItem(user, wallet);	
		console.log(localStorage)	
	});
	
}

exports.readSafeStorage = function(data, out){
	var wallet = localStorage.getItem(data.user);
	try{
			
			var ope = JSON.parse(wallet);
			var params = ope.params;
			var salt = params.salt;
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
	var JSON_data = JSON.parse(data);
	var user = JSON_data.user;
	var wallet = localStorage.getItem(user);
	var params = wallet.params;
	var salt = params.salt;
	var kdfResult = scrypt(passphrase, salt, params.N, params.r, params.p, params.keyLen)
	var encryptedWallet = CryptoJS.AES.encrypt(data, kdfResult.toString('hex')).toString();
	var wallet = JSON.stringify({encryptedWallet: encryptedWallet, params: params})
	localStorage.removeItem(user);
	localStorage.setItem(user, wallet);
}

exports.deleteSafeStorage = function(data, passphrase){
	var JSON_data = JSON.parse(data);
	var user = JSON_data.user;
 	localStorage.removeItem(user);
}

function generateSalt(data, out){
	var salt = "6CoeaohnQBMLYbQU3nkyfGqMeLG68n8MVnf5Zk2dzN2Bocdq43";
	var kdfResult = scrypt(data.user, salt, 16384, 8, 1, 64).toString('hex');
	out({salt: kdfResult});
}
