(function($) {
	const steem = require("steem");
	const io = require('socket.io-client');
	const SM = require('./SM.js');
	const UI = require('./UI.js');

	var element = function(id){
		return document.getElementById(id);
	}

	var DaButton = element('DaButton');
	var returnToSelection = element('returnToSelection');
	var messages = element('messages');
	var textarea = element('textarea');
	var username = element('username');
	var privMemoKey = element('privMemoKey');
	var newPassphrase = element('newPassphrase')
	var newPassphrase2 = element('newPassphrase2');
	var passphraseUsername = element('passphraseUsername');
	var passphrase = element('passphrase');
	var passphraseLoginBtn = element('PassphraseLoginBtn');
	var receiver = element('receiver');
	var clearBtn = element('clear');
	var loginBtn = element('login');
	var friendBtn = element('friend');
	var startBtn = element('start');
	var createPassphraseBtn = element("createPassphraseBtn");
	var splash = element("splash");
	var loader0 = element("loaderEffect0");
	var loader1 = element("loaderEffect1");
	var loader2 = element("loaderEffect2");
	var loader3 = element("loaderEffect3");
	var loader4 = element("loaderEffect4");
	var loader5 = element("loaderEffect5");
	var fileSend = element('fileSend');
	var emojiList = element("emoji-list");
	loader0.style.display = "none";
	loader1.style.display = "none";
	loader2.style.display = "none";
	loader3.style.display = "none";
	loader4.style.display = "none";
	loader5.style.display = "none";


	var user;
	var key;
	var cookieB;
	var recipient;
	var socket = io.connect();
	var keys;
	var chatOpen;

	// Check for connection
	if(socket !== undefined){
		console.log('Connection to server successful!');


		DaButton.addEventListener('click', function(){
			if(chatOpen == 1){
				document.getElementById("DaChat").style.display = "none";
				$(".app").removeClass("full");
				chatOpen = 0;
			}
			else {
				chatOpen = 1;
				$(".app").addClass("full");
				document.getElementById("DaChat").style.display = "block";
			}
		});



		startBtn.addEventListener('click', function(){
			SM.checkIfAlreadyConnected();
		});

		loginBtn.addEventListener('click', function() {
			SM.login({user:username.value, privWif:privMemoKey.value}, function(result){
				user = result.user;
				key = result.key;
				return socket.emit('initialize', {encodedmsg: result.encodedmsg});
			});
		});

		createPassphraseBtn.addEventListener('click', function(){
			SM.createWalletPassphrase({pass1: newPassphrase.value, pass2: newPassphrase2.value}, function(result){
				if(result == "unmatching passphrases"){
					UI.onPassphraseUnmatchShowError();
				}
				if(result == "ok"){
					SM.initializeKeys({user: user, key: key, passphrase: newPassphrase.value}, function(out){
						keys = {uniquePublic:out.uniquePublic, uniquePrivate:out.uniquePrivate, authenticationKey:out.authenticationKey, encryptionKey: out.encryptionKey};
						UI.onNewPassphraseShowSuccessScreen();
					});
				}
			})
		});

		passphraseLoginBtn.addEventListener('click', function() {
			SM.passphraseLogin({user:passphraseUsername.value, passphrase:passphrase.value}, function(result){
				var wallet = result.wallet;
				var encodedContainer = result.encodedContainer;
				user = wallet.user;
		        key = wallet.privateKey;
		        keys = {uniquePublic:wallet.uniquePublic, uniquePrivate:wallet.uniquePrivate, authenticationKey:wallet.authenticationKey, encryptionKey: wallet.encryptionKey};		  
		        socket.emit('reinitialize', {encodedmsg: encodedContainer});
		        UI.onValidPassphraseShowLoginSuccessScreen();
			});
		});

		receiver.addEventListener('keydown', function(event){
			if(event.which === 13 && event.shiftKey == false){
				if(receiver.value != "") {
					console.log(key);
					SM.chooseFriend({name:user, to:receiver.value, key: key, keys: keys}, function(out){
						recipient = out.to;
						receiver.value = "";
						return socket.emit('fetchDiscussion', {message: out.encodedmsg});
					});
				}
			}
		});

		socket.on('logged', function(){
			UI.onFirstLoginShowPassphraseSelectorScreen(); 
		})

		socket.on('latest discussions', function(data){
			if(key !== undefined) {
				console.log(data);
				if(data.length) {
					return SM.appendDiscussions(data, {id:user, key:key, uniqueKey:keys.uniquePrivate});
				}
			}
		});

		socket.on('output', function(data){
			if(key !== undefined) {
				if(data.length) {
					UI.hideWhoIsWriting();
					return SM.appendMessages(data, {id:user, key:key, uniqueKey:keys.uniquePrivate, receiver:recipient});
				}
			}
		});

		socket.on('recipient is writing', function(data){
			if(data.name == recipient){
				SM.recipientIsWriting(data);
			}
		})

		socket.on('file output', function(data){
			if(key !== undefined) {
					return SM.appendFile(data, {id:user,key:key,receiver:recipient});
			}
		});

		textarea.addEventListener('keydown', function(event){
			socket.emit('is writing', {name:user, to:recipient});
			if(event.which === 13 && event.shiftKey == false){
				if(textarea.value != "") {
					SM.handleInput({user:user,receiver:recipient,key:key,uniquePrivate:keys.uniquePrivate,message:textarea.value}, function(out){
						return socket.emit('input', {message:out.encodedmsg});
					});
				}
			}
		});



		fileSend.addEventListener("change", function () {
			console.log(this.files[0].size);
			if(this.files[0].size > 100000){
				this.value = "";
		        return alert("File is too big!");
		    }
		    else {
				var file = this.files[0];
				var reader = new FileReader();
				reader.onloadend = function() {
		    		//console.log('RESULT', reader.result)
		    		SM.handleFile({user:user, receiver:recipient, key:key, file:reader.result}, function(out){
		    			encoded = out.encodedfile;
		    			return socket.emit('file input', {
		    				name:user,
		    				to:recipient,
		    				file:encoded,
		    			});

		    		});
		    	}
		    	reader.readAsDataURL(file);
		    }
		});


		emojiList.addEventListener("click",function(e) {
			if(e.target && e.target.nodeName == "LI") {
				textarea.value = textarea.value + " " + e.target.innerHTML;
			}
		});

		exports.fetchDiscussion = function(data){
			SM.chooseFriend({to:data.receiver, name:user, key: key, keys: keys}, function(out){
				recipient = out.receiver;
				return socket.emit('fetchDiscussion', {message: out.encodedmsg});
			});
		}

		returnToSelection.addEventListener('click', function(){
			socket.emit('fetchDiscussions', {name:user});
			UI.returnToPreviousDiscussions();
			recipient = undefined;
		});

		clearBtn.addEventListener('click', function(){
			messages.innerHTML = "";
			return socket.emit('clear', {
				name:user,
				to:recipient
			});
		});

		socket.on('cleared', function(){
			messages.innerHTML = "";
		});

	}
})(jQuery);
