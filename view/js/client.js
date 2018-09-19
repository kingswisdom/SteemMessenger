(function($) {
	const io 		= require('socket.io-client');
	const SM 		= require('./SM.js');
	const UI 		= require('./UI.js');
	const Lara 		= require('./Lara-client.js')

	var element = function(id){	return document.getElementById(id);	}

	var body 					= element('thisisit');
	var app 					= element('app');
	var messages 				= element('messages');
	var textarea 				= element('textarea');
	var username 				= element('username');
	var privMemoKey 			= element('privMemoKey');
	var newPassphrase 			= element('newPassphrase')
	var newPassphrase2 			= element('newPassphrase2');
	var passphraseUsername 		= element('passphraseUsername');
	var passphrase 				= element('passphrase');
	var receiver 				= element('receiver');
	var loader0 				= element("loaderEffect0");
	var loader1 				= element("loaderEffect1");
	var loader2 				= element("loaderEffect2");
	var loader3 				= element("loaderEffect3");
	var loader4 				= element("loaderEffect4");
	var loader5 				= element("loaderEffect5");
	var fileSend 				= element('fileSend');
	var emojiList 				= element("emoji-list");

	loader0.style.display 		= "none";
	loader1.style.display 		= "none";
	loader2.style.display 		= "none";
	loader3.style.display 		= "none";
	loader4.style.display 		= "none";
	loader5.style.display 		= "none";


	var user;
	var key;
	var keys;
	var recipient;
	var recipient_pubWIF;
	var recipient_sharedKey;
	var socket = io.connect();

	// Check for connection
	if(socket !== undefined){
		console.log('Connection to server successful!');

		body.addEventListener("click",function(e) {
			if(e.target) {
				switch(e.target.id) {
					case "start":
						return SM.checkIfAlreadyConnected();

					case "login":
						return login();

					case "createPassphraseBtn":
						return createPassphrase();

					case "returnToSelection":
						return returnToPreviousDiscussions();						

				    case "PassphraseLoginBtn":
				    	return passphraseLogin();				    	

				    case "clear":
				    	return clearMessages();

				    case "DaButton":
				    	return UI.switchAppDisplay();

				    case "emojiBtn":
				    	return UI.switchEmojisBoxDisplay();

				    case "settings":
				    	return UI.openSettings();
				}
			}
		});

		app.addEventListener('keydown', function(event){
			if(event.target){
				switch(event.target.id){
					case "passphrase":
						if(event.which === 13 && event.shiftKey == false){
							return passphraseLogin();
						}
					case "receiver":
						if(event.which === 13 && event.shiftKey == false){
							return getReceiver();
						}
					case "textarea":
						/*Lara.encodeSafeSocket({request: "is writing", identity: user, user: user, to: recipient}, key, function(out){
							socket.emit("safeSocket", out);
						});*/
						if(event.which === 13 && event.shiftKey == false){
							return sendMessage();
						}
				}
			}
		});

		socket.on('safeSocket', function(data){
			Lara.decodeSafeSocket(data, key, function(out){
				console.log("socket : " + out.request)
				if(out.request !== undefined){
					switch(out.request) {
				    	case "logged":
				      		return UI.onFirstLoginShowPassphraseSelectorScreen();

				      	case "leaked":
				      		return UI.onLeakedKeyShowWarning();

				      	case "latest discussions":
				      		return SM.appendDiscussions(out, {id:user, key:key, uniqueKey:keys.uniquePrivate});

				      	case "output":
				      		UI.hideWhoIsWriting();
							return SM.appendMessages(out, {id: user, receiver: recipient, sharedKey: recipient_sharedKey});

				      	case "not subscribed":
				      		return SM.showPlans({id:user});

				      	case "blacklisted":
				      		return alert("This user blacklisted you ! You are not allowed to send him messages");

				      	case "recipient is writing":
				      		if(data.user == recipient){
								return SM.recipientIsWriting(out);
							}

				      	case "file output":
				      		return SM.appendFile(out, {id:user, receiver:recipient, sharedKey: recipient_sharedKey});

				      	case "cleared":
				      		return messages.innerHTML = "";

				    }					
				}
			})
		});

		fileSend.addEventListener("change", function () {
			if(this.files[0].size > 100000){
				this.value = "";
		        return alert("File is too big!");
		    } 
		    else {
				var file = this.files[0];
				var reader = new FileReader();
				reader.onloadend = function() {
		    		SM.handleFile({user: user, sharedKey: recipient_sharedKey, file: reader.result}, function(out){
		    			Lara.encodeSafeSocket({request: "file input", identity: user, user: user, to: recipient, message: out.encodedfile}, key, function(res){
							return socket.emit("safeSocket", res);
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
			SM.chooseFriend({to:data.receiver, key:key, user:user}, function(out){
				recipient 			= out.to;
				recipient_pubWIF 	= out.pubWif;
				recipient_sharedKey = out.sharedKey;
				Lara.encodeSafeSocket({request: "getDiscussion", identity: user, user: user, to: recipient}, key, function(res){
					return socket.emit("safeSocket", res);
				});
			});
		}

		function login(){
			SM.login({user:username.value, privWif:privMemoKey.value}, function(result){
				console.log(result)
				user 	= result.user;
				key 	= result.key;
				return socket.emit('initialize', {encodedmsg: result.encodedmsg});
			});
		}

		function createPassphrase(){
			SM.createWalletPassphrase({pass1: newPassphrase.value, pass2: newPassphrase2.value}, function(result){
				if(result == "unmatching passphrases"){
					UI.onPassphraseUnmatchShowError();
				}
				if(result == "ok"){
					Lara.initializeKeys({user: user, key: key, passphrase: newPassphrase.value}, function(out){
						keys =  {
									uniquePublic: out.uniquePublic,
									uniquePrivate: out.uniquePrivate,
									authenticationKey: out.authenticationKey,
									encryptionKey: out.encryptionKey
								};
						UI.onNewPassphraseShowSuccessScreen();
					});
				}
			});
		}

		function returnToPreviousDiscussions(){
			UI.returnToPreviousDiscussions();
			recipient 				= undefined;
			recipient_pubWIF 		= undefined;
			recipient_sharedKey 	= undefined;
			Lara.encodeSafeSocket({request: "getDiscussions", identity: user, user: user}, key, function(res){
				return socket.emit("safeSocket", res);
			});
		}

		function getReceiver(){
			if(receiver.value != "") {
				SM.chooseFriend({user:user, key:key, to:receiver.value}, function(out){
					recipient 			= out.to;				
					recipient_pubWIF 	= out.pubWif;					
					recipient_sharedKey = out.sharedKey;
					receiver.value 		= "";
					Lara.encodeSafeSocket({request: "getDiscussion", identity: user, user: user, to: recipient}, key, function(res){
						return socket.emit("safeSocket", res);
					});
				});
			}
		}

		function sendMessage(){
			if(textarea.value != "") {
				SM.handleInput({user: user, sharedKey: recipient_sharedKey, message: textarea.value}, function(out){
					Lara.encodeSafeSocket({request: "input", identity: user, user: user, to: recipient, message: out.encodedmsg}, key, function(res){
						return socket.emit("safeSocket", res);
					});
				});
			}
		}

		function passphraseLogin(){
			SM.passphraseLogin({user:passphraseUsername.value, passphrase:passphrase.value}, function(result){
				var wallet 				= result.wallet;
				var encodedContainer 	= result.encodedContainer;
				user 					= wallet.user;
				key 					= wallet.privateKey;
				keys 					=   {
												uniquePublic: wallet.uniquePublic,
												uniquePrivate: wallet.uniquePrivate,
												authenticationKey: wallet.authenticationKey,
												encryptionKey: wallet.encryptionKey
											};

				socket.emit('reinitialize', {encodedmsg: encodedContainer});
				UI.onValidPassphraseShowLoginSuccessScreen();
			});
		}

		function printEmoji(){
			if(e.target && e.target.nodeName == "LI"){
				return textarea.value = textarea.value + " " + e.target.innerHTML;
			}
		}

		function clearMessages(){
			messages.innerHTML = "";
			Lara.encodeSafeSocket({request: "clear", identity: user, user: user, to: recipient}, key, function(res){
				return socket.emit("safeSocket", res);
			});
		}
	}
})(jQuery);
