(function () {
	
const steem = require("steem");	
var io = require('socket.io-client');

/*--------------------------------
-----Get Elements from html-------
--------------------------------*/

var element = function(id){
	return document.getElementById(id);
}

var status = element('status');
var messages = element('messages');
var textarea = element('textarea');
var username = element('username');
var privMemoKey = element('privMemoKey');
var receiver = element('receiver');
var clearBtn = element('clear');
var loginBtn = element('login');
var friendBtn = element('friend');
var a = element("login-success");
var b = element("login-success2");
var x = element("login-interface");
var y = element("chat-container");
y.style.display = "none";
a.style.display = "none";
b.style.display = "none";

// Set default status
var statusDefault = status.textContent;

var setStatus = function(s){
	// Set status
	status.textContent = s;

	if(s !== statusDefault){
		var delay = setTimeout(function(){
			setStatus(statusDefault);
		}, 4000);
	}
}

/*--------------------------------
------Connect to socket.io--------
--------------------------------*/

var socket = io.connect('http://127.0.0.1:4000');

// Check for connection
if(socket !== undefined){
	console.log('Connection to socket successful !');

	/*--------------------------------
	-------------Log in---------------
	--------------------------------*/
	loginBtn.addEventListener('click', function(){

			var user = username.value;
				steem.api.getAccounts([user], function(err, result) {
					if(result.length > 0) {
						privWif = privMemoKey.value;
						pubWif = result[0]["memo_key"];
						var isvalid = steem.auth.wifIsValid(privWif, pubWif);
						console.log(isvalid);
						if(isvalid == true){
							var privateMemoKey = privWif;
							x.style.display = "none";
							a.style.display = "block";
							friendBtn.addEventListener('click', function(){
								var to = receiver.value;
								steem.api.getAccounts([to], function(err, result) {
									if(result.length > 0) {
										var receiver = to;
										a.style.display = "none";
										b.style.display = "block";
										y.style.display = "block";
										socket.emit('logged', {
												name:user,
												to:receiver,
										});
										
										/*--------------------------------
										----------Handle Output-----------
										--------------------------------*/
										socket.on('output', function(data){
											if(privateMemoKey !== undefined) {
												//console.log(data);
												if(data.length){						
													for(var x = 0;x < data.length;x++){
														// Decode messages locally
														var raw = data[x].message;
														var author = data[x].author
															author1 = author.toString();
														var decoded = steem.memo.decode(privateMemoKey, raw);
														// Build message div
														if(author1 == user) {
															var message = document.createElement('div');
															message.setAttribute('class', 'msg-containerblue');	
															message.setAttribute('align', 'right');								
															message.textContent = author1 + " : " + decoded;
															messages.appendChild(message);
															//messages.insertBefore(message, messages.firstChild);
														}
														else {
															var message = document.createElement('div');
															message.setAttribute('class', 'msg-container');	
															message.setAttribute('align', 'left');											
															message.textContent = author1 + " : " + decoded;
															messages.appendChild(message);
															//messages.insertBefore(message, messages.firstChild);
														}
													}
												}
											}
										});
	
										/*-------------------------------- 
										----------Handle Input------------
										--------------------------------*/

										textarea.addEventListener('keydown', function(event){
											if(event.which === 13 && event.shiftKey == false){
												// Find receiver's Public Memo Key								
												steem.api.getAccounts([receiver], function(err, result) {
													if(result.length > 0) {
														publicMemoReceiver = result[0]["memo_key"];
														texte = "#" + textarea.value;
														var encoded = steem.memo.encode(privateMemoKey, publicMemoReceiver, texte);	
														// Emit to server input
														socket.emit('input', {
															name:user,
															to:receiver,
															message:encoded
														});
													}
												});
												event.preventDefault();
											}	
										});
	
										/*-------------------------------
										-----Get Status From Server------
										--------------------------------*/

										socket.on('status', function(data){
											// get message status
											setStatus((typeof data === 'object')? data.message : data);
											// If status is clear, clear text
											if(data.clear){
												textarea.value = '';
											}
										});

										/*--------------------------------
										--------Handle Chat Clear---------
										--------------------------------*/

										clearBtn.addEventListener('click', function(){
											socket.emit('clear');
										});

										/*--------------------------------
										----------Clear Message----------- 
										--------------------------------*/
										socket.on('cleared', function(){
											messages.textContent = '';
										});
									}
								})
							})
						}
						
						else {
							var privateMemoKey = "";
							console.log("login error");
						}
					}
				});
	});
}

})();