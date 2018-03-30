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
var x = document.getElementById("login-interface");
var y = document.getElementById("chat-container");
y.style.display = "none";


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
	console.log('Connection successful !');

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
							y.style.display = "block";
							
							
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
											var decoded = steem.memo.decode(privateMemoKey, raw);
											// Build message div
											var message = document.createElement('div');
											message.setAttribute('class', 'chat-message');
											message.textContent = data[x].name+": "+decoded;
											messages.appendChild(message);
											messages.insertBefore(message, messages.firstChild);
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
									var recipient = receiver.value;
									steem.api.getAccounts([recipient], function(err, result) {
										if(result.length > 0) {
											publicMemoReceiver = result[0]["memo_key"];
											texte = "#" + textarea.value;
											var encoded = steem.memo.encode(privateMemoKey, publicMemoReceiver, texte);	
											// Emit to server input
											socket.emit('input', {
												name:username.value,
												to:receiver.value,
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
						else {
							var privateMemoKey = "";
							console.log("login error");
						}
					}
				});
		
	});
	
	
}
})();