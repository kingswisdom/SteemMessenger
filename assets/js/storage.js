var CryptoJS = require("crypto-js");


exports.createSafeStorage = function(data, passphrase){
	var JSON_data = JSON.parse(data);
	var user = JSON_data.user;	
	var encryptedWallet = CryptoJS.AES.encrypt(data, passphrase).toString();
	localStorage.setItem(user, encryptedWallet);
}

exports.readSafeStorage = function(data, wallet){
	var encryptedWallet = localStorage.getItem(data.user);
	var decryptedWallet = CryptoJS.AES.decrypt(encryptedWallet, data.passphrase).toString(CryptoJS.enc.Utf8);
	var JSON_wallet = JSON.parse(decryptedWallet);
	wallet(JSON_wallet);
}

exports.updateSafeStorage = function(data, passphrase){
	var JSON_data = JSON.parse(data);
	var user = JSON_data.user;
 	localStorage.removeItem(user);
 	var encryptedWallet = CryptoJS.AES.encrypt(data, passphrase).toString();
	localStorage.setItem(user, encryptedWallet);
}

exports.deleteSafeStorage = function(data, passphrase){
	var JSON_data = JSON.parse(data);
	var user = JSON_data.user;
 	localStorage.removeItem(user);
}