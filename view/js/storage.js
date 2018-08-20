var CryptoJS = require("crypto-js");
var scrypt = require('scryptsy');

exports.createSafeStorage = function(data, passphrase){
	var JSON_data = JSON.parse(data);
	var user = JSON_data.user;
	generateSalt({user:user}, function(out){
		var salt = out.salt;
		console.log(salt);
		var kdfResult = scrypt(passphrase, salt, 65536, 8, 2, 64)
		var encryptedWallet = CryptoJS.AES.encrypt(data, kdfResult.toString('hex')).toString();
		console.log(encryptedWallet)
		localStorage.setItem(user, encryptedWallet);		
	});
	
}

exports.readSafeStorage = function(data, wallet){
	var encryptedWallet = localStorage.getItem(data.user);
	try{
		generateSalt(data.user, function(out){
			var salt = out.salt;
			var kdfResult = scrypt(data.passphrase, salt, 65536, 8, 2, 64)
			var decryptedWallet = CryptoJS.AES.decrypt(encryptedWallet, kdfResult.toString('hex')).toString(CryptoJS.enc.Utf8);	
			var JSON_wallet = JSON.parse(decryptedWallet);
			wallet(JSON_wallet);
		});
	}
	catch(err) {
    	wallet(err);
    }
	
}

exports.updateSafeStorage = function(data, passphrase){
	var JSON_data = JSON.parse(data);
	var user = JSON_data.user;
 	localStorage.removeItem(user);
 	generateSalt(data.user, function(out){
		var salt = out.salt;
		var kdfResult = scrypt(passphrase, salt, 65536, 8, 2, 64)
		var encryptedWallet = CryptoJS.AES.encrypt(data, kdfResult.toString('hex')).toString();
		localStorage.setItem(user, encryptedWallet);
	});
}

exports.deleteSafeStorage = function(data, passphrase){
	var JSON_data = JSON.parse(data);
	var user = JSON_data.user;
 	localStorage.removeItem(user);
}

function generateSalt(data, out){
	var salt = "6CoeaohnQBMLYbQU3nkyfGqMeLG68n8MVnf5Zk2dzN2Bocdq43";
	var kdfResult = scrypt(data.user, salt, 16384, 8, 1, 64).toString('hex');
	console.log(kdfResult);
	out({salt: kdfResult});
}
