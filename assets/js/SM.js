const steem = require("steem");
const client = require("./client.js");
const libcrypto = require('@steemit/libcrypto');
const crypto = require ('./crypto');
const UIlib = require('./UIlib.js');
const UI = require('./UI.js');
const login = require('./login.js')
const storage = require('./storage.js');

var element = function(id){
    return document.getElementById(id);
}
var LaraPublicKey = '';
var messages = element('messages');
var receiverInfo = element("receiver-info");
var previousDiscussions = element("previousDiscussions");
receiverInfo.style.display = "none";




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



exports.initializeKeys = function(data, out){
    //data.key
    var uniqueMemoKeys = libcrypto.generateKeys();
    var uniquePrivate = uniqueMemoKeys.private;
    var uniquePublic = uniqueMemoKeys.public;
    console.log(data);
    /* check that the session keys generation works client side*/
    var sessionKeys = crypto.generate_session_keys(data.key, LaraPublicKey);
    console.log("init keys");
    console.log(sessionKeys);
    var wallet = '{"user":"' + data.user + '","privateKey":"' + data.key + '","uniquePrivate":"' + uniquePrivate + '","uniquePublic":"' + uniquePublic + '","authenticationKey":"' + sessionKeys.authenticationKey + '","encryptionKey":"' + sessionKeys.encryptionKey + '"}'
    storage.createSafeStorage(wallet, data.passphrase);
    out({user: data.user, privateKey: data.key, uniquePrivate: uniquePrivate, uniquePublic: uniquePublic, authenticationKey: sessionKeys.authenticationKey, encryptionKey: sessionKeys.encryptionKey });
}

exports.createWalletPassphrase = function(data, result){
    if(data.pass1 === data.pass2){

        result("ok");
    }
    else{
        result("unmatching passphrases");
    }
}

exports.chooseFriend = function(data, out){
    UIlib.showLoader2();
    var to = data.to;
    steem.api.getAccounts([to], function(err, result) {
        if(result.length > 0) {
            UIlib.hideLoader2();
            UIlib.hideLoginSuccess();
            UIlib.showChatContainer();
            var receiverInf = document.createElement('div');
            receiverInf.setAttribute("id", "receiverInf");
            var receiverpicture = document.createElement("img");
            receiverpicture.setAttribute("id", "receiverpicture");
            receiverpicture.setAttribute("src", "https://steemitimages.com/u/" + to + "/avatar");
            receiverpicture.setAttribute("height", "36");
            receiverpicture.setAttribute("width", "36");
            receiverpicture.setAttribute("style", "border-radius:50%;margin-top: 5px;margin-left: 5px;");
            receiverInfo.appendChild(receiverpicture);
            receiverInf.textContent = "@" + data.to;
            receiverInfo.appendChild(receiverInf);
            UIlib.showReceiverInfo();
            var Container = "#" + JSON.stringify({user: data.name, to: data.to, token: authenticationToken});
            var encodedContainer = steem.memo.encode(data.key, LaraPublicKey, Container);
            out({encodedmsg: encodedContainer});
        }
        else {
            UIlib.hideLoader2();
            alert("Error : This user doesn't exist !");
        }
    });
}

exports.handleInput = function(data, out){
    UIlib.hideChatTextInputArea();
    UIlib.showLoader3()
    steem.api.getAccounts([data.receiver], function(err, result) {
        if(result.length > 0) {
            console.log(data.receiver + " is valid");
            var publicMemoReceiver = result[0]["memo_key"];
            var texte = "#" + data.message;
            var privateMemoKey = data.key;
            var encoded = steem.memo.encode(data.uniquePrivate, publicMemoReceiver, texte);
            var sessionKeys = crypto.generate_session_keys(privateMemoKey, LaraPublicKey);
            var authenticationToken = crypto.authentication_token(sessionKeys.authenticationKey);
            var Container = "#" + JSON.stringify({user: data.user, to: data.receiver, token: authenticationToken, message: encoded});
            var encodedContainer = steem.memo.encode(privateMemoKey, LaraPublicKey, Container);
            out({encodedmsg: encodedContainer});
        }
        else {
            UIlib.showChatTextInputArea();
            UIlib.clearChatTextInputArea();
            alert("Error : no receiver found !");
        }
    });
}

exports.recipientIsWriting = function(data){
    UI.showWhoIsWriting(data);
}

exports.handleFile = function(data, out){
    UIlib.hideChatTextInputArea();
    UIlib.showLoader3();
    receiver = data.receiver;
    steem.api.getAccounts([receiver], function(err, result) {
        if(result.length > 0) {
            var publicMemoReceiver = result[0]["memo_key"];
            var texte = "#" + data.file;
            var privateMemoKey = data.key;
            var encoded = steem.memo.encode(privateMemoKey, publicMemoReceiver, texte);
            out({encodedfile: encoded});
        }
        else {
            UIlib.hideLoader3();
            UIlib.showChatTextInputArea();
            UIlib.clearChatTextInputArea();
            alert("Error : no receiver found !");
        }
    });
}

exports.appendMessages = function(data, ind){
    for(var x = 0;x < data.length;x++){
        var raw = data[x].message;
        var author = data[x].from;
        author1 = author.toString();
        if(author1 == ind.id) {
            var decoded = steem.memo.decode(ind.uniqueKey, raw);
            var decodedFinal = decoded.split("");
            decodedFinal.shift();
            var decodedFinal = decodedFinal.join("");
            var timestamp = document.createElement('div');
            timestamp.setAttribute('align', 'right');
            timestamp.setAttribute('class', 'timestamp');
            timestamp.textContent = new Date(data[x].timestamp).getHours() < 13 ? `${new Date(data[x].timestamp).getHours()}: ${new Date(data[x].timestamp).getMinutes()} AM` : `${new Date(data[x].timestamp).getHours() - 12}: ${new Date(data[x].timestamp).getMinutes()} PM`
            var message = document.createElement('div');
            message.setAttribute('class', 'msg-containerblue');
            message.setAttribute('align', 'right');
            var messageText = document.createElement('div');
            messageText.setAttribute('align', 'left');
            messageText.setAttribute('class', 'msg-container-text');
            messageText.textContent = decodedFinal;
            messages.appendChild(message);
            message.appendChild(messageText);
            messages.appendChild(timestamp);
            UIlib.hideLoader3();
            UIlib.showChatTextInputArea();
            UIlib.clearChatTextInputArea();
            UIlib.focusChatTextInputArea();
            messages.scrollTop = messages.scrollHeight;
            //messages.insertBefore(message, messages.firstChild);
        }
        if(author1 == ind.receiver) {
            var decoded = steem.memo.decode(ind.key, raw);
            var decodedFinal = decoded.split("");
            decodedFinal.shift();
            var decodedFinal = decodedFinal.join("");
            var timestamp = document.createElement('div');
            timestamp.setAttribute('align', 'left');
            timestamp.setAttribute('class', 'timestamp');
            timestamp.textContent = new Date(data[x].timestamp).getHours() < 13 ? `${new Date(data[x].timestamp).getHours()}: ${new Date(data[x].timestamp).getMinutes()} AM` : `${new Date(data[x].timestamp).getHours() - 12}: ${new Date(data[x].timestamp).getMinutes()} PM`
            var message = document.createElement('div');
            message.setAttribute('class', 'msg-container');
            message.setAttribute('align', 'left');
            var messageText = document.createElement('div');
            messageText.setAttribute('align', 'left');
            messageText.setAttribute('class', 'msg-container-text');
            messageText.textContent = decodedFinal;
            messages.appendChild(message);
            message.appendChild(messageText);
            messages.appendChild(timestamp);
            messages.scrollTop = messages.scrollHeight;
            UIlib.notification();
            //messages.insertBefore(message, messages.firstChild);
        }
        else {
        }
    }
}


exports.appendDiscussions = function(data, ind){
    var discussionPicture;
    if(data.length){
        console.log(data);
        for(var x = 0;x < data.length;x++){
            var raw = data[x].message;
            var author = data[x].from;
            author = author.toString();
            var author2 = data[x].to;
            author2 = author2.toString();
            if(author == ind.id) {
                var decoded = steem.memo.decode(ind.uniqueKey, raw);
                var decodedFinal = decoded.split("");
                decodedFinal.shift();
                part = decodedFinal.slice(0, 34);
                var decodedFinal = part.join("") + "...";
                var discussion = document.createElement('div');
                discussion.setAttribute('class', 'discussionOld');
                var discpicture = document.createElement("img");
                discpicture.setAttribute("src", "https://steemitimages.com/u/" + author2 + "/avatar");
                discpicture.setAttribute("height", "36");
                discpicture.setAttribute("width", "36");
                discpicture.setAttribute("style", "float:left;border-radius:50%;border-width:2px;bordercolor:#fff;margin-top: 12px;margin-left: 5px;margin-right: 15px;");
                discussion.appendChild(discpicture)
                discussion.addEventListener("click", (function(author2) {
                    return function () {
                        client.fetchDiscussion({receiver: author2});
                    }
                })(author2));
                var discussionText = document.createElement('div');
                discussionText.setAttribute('align', 'left');
                discussionText.innerHTML = "<b>@" + author2 + "</b>" + " <br>" + decodedFinal;
                previousDiscussions.insertBefore(discussion, previousDiscussions.firstChild);
                discussion.appendChild(discussionText);


            }
            else {
                var decoded = steem.memo.decode(ind.key, raw);
                var decodedFinal = decoded.split("");
                decodedFinal.shift();
                part = decodedFinal.slice(0, 34);
                var decodedFinal = part.join("") + "...";
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
                discussionText.innerHTML = "<b>@" + author + "</b>" + " <br>" + decodedFinal;
                previousDiscussions.insertBefore(discussion, previousDiscussions.firstChild);
                discussion.appendChild(discussionText);
            }
        }
    }
    else{

    }
}

exports.appendFile = function(data, ind){
    var raw = data.file;
    var author = data.name;
    author1 = author.toString();
    var decoded = steem.memo.decode(ind.key, raw);
    var decodedFinal = decoded.split("");
    decodedFinal.shift();
    var decodedFinal = decodedFinal.join("");
    var image = new Image();
    image.src = decodedFinal;
    if(author1 == ind.id){
        var message = document.createElement('div');
        message.setAttribute('class', 'msg-containerblue');
        message.setAttribute('align', 'right');
        var messageImage = document.createElement("img");
        messageImage.setAttribute("src", image.src);
        messageImage.setAttribute("height", "170");
        messageImage.setAttribute("width", "170");
        messages.appendChild(message);
        message.appendChild(messageImage);
        UI.showChatTextInputArea();
        messages.scrollTop = messages.scrollHeight;
    }
    if(author1 == ind.receiver){
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
    }
    else{
    }
}
