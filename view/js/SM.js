const steem         = require("steem");
const client        = require("./client.js");
const crypto        = require ('./crypto');
const config        = require('./config.json');
const UIlib         = require('./UIlib.js');
const UI            = require('./UI.js');
const login         = require('./login.js')
const Lara          = require('./Lara-client.js')

var element = function(id){ return document.getElementById(id); }

var messages                    = element('messages');
var receiverInfo                = element("receiver-info");
var previousDiscussions         = element("previousDiscussions");
receiverInfo.style.display      = "none"; //TODO : edit the css and add this style as native parameter, then delete this line


exports.checkIfAlreadyConnected = function(){
    console.log(localStorage);
    if(localStorage.length != 0){
        UI.onConnectedShowPassphraseLoginInterface();
    }
    else{
        UI.onNotConnectedShowLoginInterface();
    }
}

exports.login = function(data, result){
    UIlib.showLoader1();
    login.firstLogin(data, function(out){
        if(out.error == "bad memo key" || out.error == "bad account"){
            UIlib.hideLoader1();
            alert("Wrong username and/or Private Memo Key");
        }
        else{
            result(out);
        }
    });
}

exports.passphraseLogin = function(data, result){
    UIlib.showLoader5();
    login.reLogin(data, function(out){
        if(out.error == "bad password" || out.error == "bad memo key" || out.error == "bad account"){
            UIlib.hideLoader5();
            alert("Wrong username and/or password");
        }
        else{
            result(out);
        }
    });
}

exports.createWalletPassphrase = function(data, result){
    if(data.pass1 === data.pass2){
        result("ok");
    }
    else{
        result("unmatching passphrases");
    }
}

exports.showPlans = function(data){
    steem.api.getDiscussionsByBlog({tag: config.SMaccount, limit: 1}, function(err, result){
        var permlink = result[0].permlink;
        return UI.onNotSubscribed({id:data.id, permlink: permlink});
    });
}

exports.chooseFriend = function(data, out){
    UIlib.showLoader2();
    var to = data.to;
    steem.api.getAccounts([to], function(err, result) {
        if(result.length > 0) {
            var pubWif = result[0]["memo_key"];
            UIlib.hideLoader2();
            UIlib.hideLoginSuccess();
            UIlib.showChatContainer();
            var receiverInf = document.createElement('div');
                receiverInf.setAttribute("id", "receiverInf");                
                receiverInf.textContent = "@" + data.to;
            var receiverpicture = document.createElement("img");
                receiverpicture.setAttribute("id", "receiverpicture");
                receiverpicture.setAttribute("src", "https://steemitimages.com/u/" + to + "/avatar");
                receiverpicture.setAttribute("height", "36");
                receiverpicture.setAttribute("width", "36");
                receiverpicture.setAttribute("style", "border-radius:50%;margin-top: 5px;margin-left: 5px;");
            receiverInfo.appendChild(receiverpicture);
            receiverInfo.appendChild(receiverInf);
            UIlib.showReceiverInfo();
            var sessionKeys = crypto.generate_session_keys(data.key,pubWif);
            out({to: to, sharedKey: sessionKeys.encryptionKey, pubWif: pubWif});
        }
        else {
            UIlib.hideLoader2();
            alert("Error : This user doesn't exist !");
        }
    });
}

exports.handleInput = function(data, out){
    UIlib.hideChatTextInputArea();
    UIlib.showLoader3();
    Lara.encodeMessage({message: data.message, sharedKey:data.sharedKey}, function(res){
        out({encodedmsg: res.encoded})
    });    
}

exports.recipientIsWriting = function(data){
    UI.showWhoIsWriting(data);
}

exports.handleFile = function(data, out){
    UIlib.hideChatTextInputArea();
    UIlib.showLoader3();    
    Lara.encodeMessage({message: data.file, sharedKey: data.sharedKey}, function(res){
        out({encodedfile: res.encoded})
    });
}

exports.appendMessages = function(rawdata, ind){
    var data = rawdata.message;
    console.log(data);
    for(let x = 0;  x < data.length;    x++){

        var raw             = data[x].message;
        var author          = data[x].from;
        var author1         = author.toString();
        var currentTime     = Date.now();
        var timestamp       = data[x].timestamp;
        var relativeTime    = timeDifference(timestamp);

        if(author1 == ind.id) {
            Lara.decodeMessage2({sharedKey: ind.sharedKey, message: raw}, function(out){

                var time = document.createElement('div');
                    time.setAttribute('align', 'right');
                    time.setAttribute('class', 'timestamp');                    
                    time.textContent = relativeTime; console.log(relativeTime);

                var message = document.createElement('div');
                    message.setAttribute('class', 'msg-containerblue');
                    message.setAttribute('style', 'order:'+x+';');
                    message.setAttribute('align', 'right');

                var messageText = document.createElement('div');
                    messageText.setAttribute('align', 'left');
                    messageText.setAttribute('class', 'msg-container-text');
                    messageText.textContent = out.decoded;

                messages.appendChild(message);
                message.appendChild(messageText);
                messages.appendChild(time);
                UIlib.hideLoader3();
                UIlib.showChatTextInputArea();
                UIlib.clearChatTextInputArea();
                UIlib.focusChatTextInputArea();
                messages.scrollTop = messages.scrollHeight;
            });
        }
        if(author1 == ind.receiver) {
            Lara.decodeMessage2({sharedKey: ind.sharedKey, message: raw}, function(out){

                var timestamp = document.createElement('div');
                    timestamp.setAttribute('align', 'left');
                    timestamp.setAttribute('class', 'timestamp');
                    timestamp.textContent = relativeTime;

                var message = document.createElement('div');
                    message.setAttribute('class', 'msg-container');
                    message.setAttribute('align', 'left');

                var messageText = document.createElement('div');
                    messageText.setAttribute('align', 'left');
                    messageText.setAttribute('class', 'msg-container-text');
                    messageText.textContent = out.decoded;

                messages.appendChild(message);
                message.appendChild(messageText);
                messages.appendChild(timestamp);
                messages.scrollTop = messages.scrollHeight;
                UIlib.notification();
            });
        }
    }
}


exports.appendDiscussions = function(rawdata, ind, blacklist){
    var data = rawdata.message
    var discussionPicture;
    var recipients = [];
    if(data.length){
        for(let i = 0; i < data.length; i++){
            if(data[i].from == ind.id){
                recipients[i] = data[i].to;
            }
            else{
                recipients[i] = data[i].from;
            }
            
        }
        steem.api.getAccounts(recipients, function(err, result){
            for(var x = 0;x < result.length;x++){
                var pubWif      = result[x]["memo_key"];
                var raw         = data[x].message;
                var author      = data[x].from;
                    author      = author.toString();
                var author2     = data[x].to;
                    author2     = author2.toString();

                if(author == ind.id) {
                    Lara.decodeMessage({key: ind.key, receiver: author2, recipient_pubWIF: pubWif, message: raw}, function(out){

                        var decodedFinal = out.decoded.split("");
                            decodedFinal = decodedFinal.slice(0, 34);
                            decodedFinal = decodedFinal.join("") + "...";

                        var discussion = document.createElement('div');
                            discussion.setAttribute('class', 'discussionOld');

                        var discpicture = document.createElement("img");
                            discpicture.setAttribute("src", "https://steemitimages.com/u/" + author2 + "/avatar");
                            discpicture.setAttribute("height", "36");
                            discpicture.setAttribute("width", "36");
                            discpicture.setAttribute("style", "float:left;border-radius:50%;border-width:2px;bordercolor:#fff;margin-top: 12px;margin-left: 5px;margin-right: 15px;");
                        
                        discussion.appendChild(discpicture);
                        discussion.addEventListener("click", (function(author2) {
                            return function () {
                                client.fetchDiscussion({receiver: author2});
                            }
                        })(author2));
                        var discussionText = document.createElement('div');
                        discussionText.setAttribute('align', 'left');
                        discussionText.innerHTML = "<b>@" + author2 + "</b>" + " <br>" + "<p>" + decodedFinal + "</p>";
                        previousDiscussions.insertBefore(discussion, previousDiscussions.firstChild);
                        discussion.appendChild(discussionText);
                    });
                }
                else {
                    Lara.decodeMessage({key: ind.key, receiver: author, recipient_pubWIF: pubWif, message: raw}, function(out){
                        
                        var decodedFinal = out.decoded.split("");
                            decodedFinal = decodedFinal.slice(0, 34);
                            decodedFinal = decodedFinal.join("") + "...";
                        
                        var discussion = document.createElement('div');
                            discussion.setAttribute('class', 'discussionNew');
                        
                        var discpicture = document.createElement("img");
                            discpicture.setAttribute("src", "https://steemitimages.com/u/" + author + "/avatar");
                            discpicture.setAttribute("height", "36");
                            discpicture.setAttribute("width", "36");
                            discpicture.setAttribute("style", "float:left;border-radius:50%;border-width:2px;bordercolor:#fff;margin-top: 12px;margin-left: 5px;margin-right: 15px;");
                        
                        discussion.appendChild(discpicture)
                        discussion.addEventListener("click", (function(author) {
                            return function () {
                                client.fetchDiscussion({receiver: author});
                            }
                        })(author));
                        var discussionText = document.createElement('div');
                        discussionText.setAttribute('align', 'left');
                        discussionText.innerHTML = "<b>@" + author + "</b>" + " <br>" + "<p>" + decodedFinal + "</p>";
                        previousDiscussions.insertBefore(discussion, previousDiscussions.firstChild);
                        discussion.appendChild(discussionText);
                    });
                }
            }
        });           
    }
}

//TODO ind? while in client.js we get appendFile(out,data)...
exports.appendFile = function(data, ind){
    console.log(data)
    var raw         = data.message;
    var author      = data.user;
    var author1     = author.toString();
    if(author1 == ind.id){
        Lara.decodeMessage2({sharedKey: ind.sharedKey, message: raw}, function(out){
            var decoded     = out.decoded;
            var image       = new Image();
                image.src   = decoded;

            var message = document.createElement('div');
                message.setAttribute('class', 'msg-containerblue');
                message.setAttribute('align', 'right');

            var messageImage = document.createElement("img");
                messageImage.setAttribute("src", image.src);
                messageImage.setAttribute("height", "170");
                messageImage.setAttribute("width", "170");

            messages.appendChild(message);
            message.appendChild(messageImage);
            UIlib.hideLoader3();
            UIlib.showChatTextInputArea();
            UIlib.clearChatTextInputArea();
            messages.scrollTop = messages.scrollHeight;
        });

    }
    if(author1 == ind.receiver){
        Lara.decodeMessage2({sharedKey: ind.sharedKey, message: raw}, function(out){
            var decoded = out.decoded;
            var image = new Image();
                image.src = decoded;

            var message = document.createElement('div');
                message.setAttribute('class', 'msg-container');
                message.setAttribute('align', 'left');
                
            var messageImage = document.createElement("img");
                messageImage.setAttribute("src", image.src);
                messageImage.setAttribute("height", "170");
                messageImage.setAttribute("width", "170");
                
            messages.appendChild(message);
            message.appendChild(messageImage);
            messages.scrollTop = messages.scrollHeight;
            UIlib.notification();
        });

    }
}

function timeDifference(previous) {
    var current         = Date.now();
    var msPerMinute     = 60 * 1000;
    var msPerHour       = msPerMinute * 60;
    var msPerDay        = msPerHour * 24;
    var msPerMonth      = msPerDay * 30;
    var msPerYear       = msPerDay * 365;
    var elapsed         = current - previous;

    if (elapsed < 2000) {
         return Math.round(elapsed/1000) + ' second ago';   
    }

    else if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}