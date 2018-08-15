var CryptoJS = require("crypto-js");
var scrypt = require('scryptsy');

exports.createSafeStorage = function(data, passphrase){
	var JSON_data = JSON.parse(data);
	var user = JSON_data.user;
	var salt = "SodiumChloride"
	var kdfResult = scrypt(passphrase, salt, 16384, 8, 1, 64)
	var encryptedWallet = CryptoJS.AES.encrypt(data, kdfResult.toString('hex')).toString();
	localStorage.setItem(user, encryptedWallet);
}

exports.readSafeStorage = function(data, wallet){
	var encryptedWallet = localStorage.getItem(data.user);
	try{
		var salt = "SodiumChloride"
		var kdfResult = scrypt(data.passphrase, salt, 16384, 8, 1, 64)
		var decryptedWallet = CryptoJS.AES.decrypt(encryptedWallet, kdfResult.toString('hex')).toString(CryptoJS.enc.Utf8);	
		var JSON_wallet = JSON.parse(decryptedWallet);
		wallet(JSON_wallet);
	}
	catch(err) {
    	wallet(err);
    }
	
}

exports.updateSafeStorage = function(data, passphrase){
	var JSON_data = JSON.parse(data);
	var user = JSON_data.user;
 	localStorage.removeItem(user);
 	var salt = "SodiumChloride"
	var kdfResult = scrypt(passphrase, salt, 16384, 8, 1, 64)
	var encryptedWallet = CryptoJS.AES.encrypt(data, kdfResult.toString('hex')).toString();
	localStorage.setItem(user, encryptedWallet);
}

exports.deleteSafeStorage = function(data, passphrase){
	var JSON_data = JSON.parse(data);
	var user = JSON_data.user;
 	localStorage.removeItem(user);
}