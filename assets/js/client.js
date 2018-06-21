const steem = require("steem");
var io = require('socket.io-client');
var SM = require('./SM.js');

var element = function(id){
	return document.getElementById(id);
}
var DaChat = element('DaChat');
var returnToSelection = element('returnToSelection');
var messages = element('messages');
var textarea = element('textarea');
var username = element('username');
var privMemoKey = element('privMemoKey');
var receiver = element('receiver');
var receiverInfo = element("receiver-info");
var clearBtn = element('clear');
var loginBtn = element('login');
var friendBtn = element('friend');
var startBtn = element('start');
var logsucc = element("login-success");
var splash = element("splash");
var loader0 = element("loaderEffect0");
var loader1 = element("loaderEffect1");
var loader2 = element("loaderEffect2");
var loader3 = element("loaderEffect3");
var loginter = element("login-interface");
var chatCont = element("chat-container");
var fileSend = element('fileSend');
var emojiList = element("emoji-list");
var emojiContainer = element("emoji-container");
var previousDiscussions = element("previousDiscussions");
emojiContainer.style.display = "none";
DaChat.style.display = "none";
loginter.style.display = "none";
chatCont.style.display = "none";
logsucc.style.display = "none";
loader0.style.display = "none";
loader1.style.display = "none";
loader2.style.display = "none";
loader3.style.display = "none";
receiverInfo.style.display = "none";


var user;
var key; //TODO clean up all the places we send the private key to the server
var recipient;
var socket = io.connect();
var keys;

// Check for connection
if(socket !== undefined){
	console.log('Connection to server successful!');


startBtn.addEventListener('click', function(){
	if(document.cookie != ""){
		startBtn.style.display = "none";
		loader0.style.display = "block";
		var cookieM = document.cookie;
		var cookieB = JSON.parse(cookieM);
		console.log(keys);
		user = cookieB.user;
		key = cookieB.privateKey;
		SM.login({user:user, privWif:key}, function(out){
			user = out.user;
			keys = {uniquePublic:cookieB.uniquePublic, uniquePrivate:cookieB.uniquePrivate, authenticationKey:cookieB.authenticationKey, encryptionKey: cookieB.encryptionKey};
			socket.emit('reinitialize', {encodedmsg: out.encodedmsg});
			splash.style.display = "none";
			logsucc.style.display = "block";
			loader0.style.display = "none";
			startBtn.style.display = "block";
		});

	}
	else{
		splash.style.display = "none";
		loginter.style.display = "block";
	}

});

loginBtn.addEventListener('click', function() {
	SM.login({user:username.value, privWif:privMemoKey.value}, function(out){
		user = out.user;
		key = out.key;
		return socket.emit('initialize', {encodedmsg: out.encodedmsg});
	});
});

receiver.addEventListener('keydown', function(event){
	if(event.which === 13 && event.shiftKey == false){
		if(receiver.value != "") {
			SM.chooseFriend({to:receiver.value}, function(out){
				recipient = out.receiver;
				receiver.value = "";
				return socket.emit('fetchDiscussion', {name:user,to:recipient});
			});
		}
	}
});

socket.on('logged', function(){
	SM.initializeKeys({key: key}, function(out){
		document.cookie = '{"user":"' + user + '","privateKey":"' + key + '","uniquePrivate":"' + out.uniquePrivate + '","uniquePublic":"' + out.uniquePublic + '","authenticationKey":"' + out.authenticationKey + '","encryptionKey":"' + out.encryptionKey + '"}';
		keys = {uniquePublic:out.uniquePublic, uniquePrivate:out.uniquePrivate, authenticationKey:out.authenticationKey, encryptionKey: out.encryptionKey};
		loader1.style.display = "none";
		loginter.style.display = "none";
		logsucc.style.display = "block";
	})

})

socket.on('latest discussions', function(data){
	console.log("getting latest discussions");
	console.log(user);
	if(key !== undefined) {
		if(data.length) {
			console.log("data is valid");
			return SM.appendDiscussions(data, {id:user,key:keys.uniquePrivate});
		}
	}
});

socket.on('output', function(data){
	if(key !== undefined) {
		if(data.length) {
			console.log("data is valid");
			return SM.appendMessages(data, {id:user,key:key,uniqueKey:keys.uniquePrivate,receiver:recipient});
		}
	}
});

socket.on('file output', function(data){
	if(key !== undefined) {
			return SM.appendFile(data, {id:user,key:key,receiver:recipient});
	}
});

textarea.addEventListener('keydown', function(event){
	if(event.which === 13 && event.shiftKey == false){
		if(textarea.value != "") {
			console.log("Handling input");
			SM.handleInput({user:user,receiver:recipient,key:key,uniquePrivate:keys.uniquePrivate,message:textarea.value}, function(out){
				encoded = out.encodedmsg;
				console.log("Input has been processed !");
				return socket.emit('input', {
					name:user,
					to:recipient,
					message:encoded
				});
				console.log("Input has been sent to server !");
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
    			loader3.style.display = "none";
				textarea.style.display = "block";
				textarea.value = "";
				textarea.focus();
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
	SM.chooseFriend({to:data.receiver}, function(out){
		recipient = out.receiver;
		return socket.emit('fetchDiscussion', {name:user,to:recipient});
	});
}

returnToSelection.addEventListener('click', function(){
	previousDiscussions.innerHTML = "";
	socket.emit('fetchDiscussions', {name:user});
	chatCont.style.display = "none";
	receiverInfo.style.display = "none";
	logsucc.style.display = "block";
	loader3.style.display = "none";
	textarea.style.display = "block";
	textarea.value = "";
	messages.innerHTML = "";
	document.getElementById('receiverpicture').remove();
	document.getElementById('receiverInf').remove();
	var recipient = undefined;
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
