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
var loader1 = element("loaderEffect");
var loader2 = element("loaderEffect2");
var loader3 = element("loaderEffect3");
var loginter = element("login-interface");
var chatCont = element("chat-container");
var fileSend = element('fileSend');
DaChat.style.display = "none";
loginter.style.display = "none";
chatCont.style.display = "none";
logsucc.style.display = "none";
loader1.style.display = "none";
loader2.style.display = "none";
loader3.style.display = "none";
receiverInfo.style.display = "none";

var user = undefined;
var key = undefined;
var recipient = undefined;

var socket = io.connect();


// Check for connection
if(socket !== undefined){
	console.log('Connection to socket successful!');


startBtn.addEventListener('click', function(){
	splash.style.display = "none";
	loginter.style.display = "block";
});



loginBtn.addEventListener('click', function() {
	SM.login({user:username.value, privWif:privMemoKey.value}, function(out){
		user = out.user
		key = out.key;
		
	});
});

friendBtn.addEventListener('click', function() {
	SM.chooseFriend({to:receiver.value}, function(out){
		recipient = out.receiver;
		socket.emit('fetchDiscussion', 
			{
				name:user,
				to:recipient,
			}
		);
	})
});

socket.on('initialization', function(data){
	if(key !== undefined) {
		if(data.length) {
			SM.appendMessages(data, {id:user,key:key,receiver:recipient});	
		}
	}
});

socket.on('output', function(data){
	if(key !== undefined) {
		if(data.length) {
			SM.appendMessages(data, {id:user,key:key,receiver:recipient});		
		}
	}
});

socket.on('file output', function(data){
	if(key !== undefined) {
			SM.appendFile(data, {id:user,key:key,receiver:recipient});
	}
});				

textarea.addEventListener('keydown', function(event){
	if(event.which === 13 && event.shiftKey == false){
		if(textarea.value != "") {
			SM.handleInput({user:user,receiver:recipient,key:key,message:textarea.value}, function(out){
				encoded = out.encodedmsg;
				socket.emit('input', {
					name:user,
					to:recipient,
					message:encoded
				});
				loader3.style.display = "none";
				textarea.style.display = "block";
				textarea.value = "";
				textarea.focus();
			})
		}
	}
});

fileSend.addEventListener("change", function () {
	console.log(this.files[0].size);
	if(this.files[0].size > 100000){
       alert("File is too big!");
       this.value = "";
    }
    else {
		var file = this.files[0];
		var reader = new FileReader();
		reader.onloadend = function() {
    		//console.log('RESULT', reader.result)
    		SM.handleFile({user:user, receiver:recipient, key:key, file:reader.result}, function(out){
    			encoded = out.encodedfile;
    			socket.emit('file input', {
    				name:user,
    				to:recipient,
    				file:encoded,
    			});
    			loader3.style.display = "none";
				textarea.style.display = "block";
				textarea.value = "";
				textarea.focus();
    		});
    	}
    	reader.readAsDataURL(file);
    }
});	

returnToSelection.addEventListener('click', function(){
	chatCont.style.display = "none";
	receiverInfo.style.display = "none";
	logsucc.style.display = "block";
	messages.innerHTML = "";
	document.getElementById('receiverpicture').remove();
	document.getElementById('receiverInf').remove();
})		
	
clearBtn.addEventListener('click', function(){
	messages.innerHTML = "";
	socket.emit('clear', {
		name:user,
		to:recipient
	});
});

socket.on('cleared', function(){
	messages.innerHTML = "";
});
}
