const steem = require("steem");
const client = require("./client.js");
const crypto = require('@steemit/libcrypto');

var element = function(id){
    return document.getElementById(id);
}
var LaraPublicKey = 'STM6CoeaohnQBMLYbQU3nkyfGqMeLG68n8MVnf5Zk2dzN2Bocdq43';
var messages = element('messages');
var textarea = element('textarea');
var receiverInfo = element("receiver-info");
var logsucc = element("login-success");
var loader1 = element("loaderEffect1");
var loader2 = element("loaderEffect2");
var loader3 = element("loaderEffect3");
var loginter = element("login-interface");
var chatCont = element("chat-container");
var previousDiscussions = element("previousDiscussions");
loginter.style.display = "none";
chatCont.style.display = "none";
logsucc.style.display = "none";
loader1.style.display = "none";
loader2.style.display = "none";
loader3.style.display = "none";
receiverInfo.style.display = "none";
var notificationSound = new Audio('./audio/light.mp3');




exports.login = function(data, out){
    loader1.style.display = "block";
    steem.api.getAccounts([data.user], function(err, result) { //Get your account info on the Steem Blockchain
        if(result.length > 0) {
            privWif = data.privWif; //Here is the private memo key you inserted
            pubWif = result[0]["memo_key"]; //Get your public Memo Key from the blockchain
            var isvalid = steem.auth.wifIsValid(privWif, pubWif); //Test if it is your key before sending info to Lara
            if(isvalid == true){
                Container = "#" + JSON.stringify({user: data.user, key: data.privWif}); //Prepare your data for encryption
                encodedContainer = steem.memo.encode(privWif, LaraPublicKey, Container);//Encrypt your credentials
                out({user: data.user, key: data.privWif, encodedmsg: encodedContainer});//Save your memo key locally and sends the "encodedmsg" to Lara

            }
            else {
            loader1.style.display = "none";
            alert("Error : Invalid Private Memo Key !")
            }
        }
        else {
            loader1.style.display = "none";
            alert("Error : This account doesn't exist !")
        }
    });
}

exports.initializeKeys = function(data, out){
    //data.key
    var uniqueMemoKeys = crypto.generateKeys();
    var uniquePrivate = uniqueMemoKeys.private;
    var uniquePublic = uniqueMemoKeys.public;
    out({uniquePrivate: uniquePrivate, uniquePublic: uniquePublic});

}

exports.chooseFriend = function(data, out){
    loader2.style.display = "block";
    var to = data.to;
    steem.api.getAccounts([to], function(err, result) {
        if(result.length > 0) {
            meta = result[0].json_metadata;
            if(meta !== "") {
                meta = JSON.parse(meta)
            }
            else {
                receiverPicture = "./images/nopic.png";
            }
            if(meta.profile !== undefined){
                receiverPicture = meta.profile.profile_image
            }
            loader2.style.display = "none";
            logsucc.style.display = "none";
            chatCont.style.display = "block";
            var receiverInf = document.createElement('div');
            receiverInf.setAttribute("id", "receiverInf");
            var receiverpicture = document.createElement("img");
            receiverpicture.setAttribute("id", "receiverpicture");
            receiverpicture.setAttribute("src", receiverPicture);
            receiverpicture.setAttribute("height", "36");
            receiverpicture.setAttribute("width", "36");
            receiverpicture.setAttribute("style", "border-radius:50%;margin-top: 5px;margin-left: 5px;");
            receiverInfo.appendChild(receiverpicture)
            receiverInf.textContent = "@" + data.to;
            receiverInfo.appendChild(receiverInf);
            receiverInfo.style.display = "block";
            out({receiver: to});
        }
        else {
            loader2.style.display = "none";
            alert("Error : This user doesn't exist !");
        }
    });
}

exports.handleInput = function(data, out){
    textarea.style.display = "none";
    loader3.style.display = "block";
    steem.api.getAccounts([data.receiver], function(err, result) {
        if(result.length > 0) {
            console.log(data.receiver + " is valid");
            publicMemoReceiver = result[0]["memo_key"];
            texte = "#" + data.message;
            privateMemoKey = data.key;
            console.log(privateMemoKey + "\n" + publicMemoReceiver)
            var encoded = steem.memo.encode(data.uniquePrivate, publicMemoReceiver, texte);
            Container = "#" + JSON.stringify({user: data.user, to: data.receiver, key: data.key, message: encoded});
            encodedContainer = steem.memo.encode(privateMemoKey, LaraPublicKey, Container);
            out({encodedmsg: encodedContainer});
        }
        else {
            loader3.style.display = "none";
            textarea.style.display = "block";
            textarea.value = "";
            textarea.focus();
            alert("Error : no receiver found !");
        }
    });
}

exports.handleFile = function(data, out){
    textarea.style.display = "none";
    loader3.style.display = "block";
    receiver = data.receiver;
    steem.api.getAccounts([receiver], function(err, result) {
        if(result.length > 0) {
            publicMemoReceiver = result[0]["memo_key"];
            texte = "#" + data.file;
            privateMemoKey = data.key;
            var encoded = steem.memo.encode(privateMemoKey, publicMemoReceiver, texte);
            out({encodedfile: encoded});
        }
        else {
            loader3.style.display = "none";
            textarea.style.display = "block";
            textarea.value = "";
            textarea.focus();
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
            loader3.style.display = "none";
            textarea.style.display = "block";
            textarea.value = "";
            textarea.focus();
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
            notificationSound.play();
            //messages.insertBefore(message, messages.firstChild);
        }
        else {
        }
    }
}


exports.appendDiscussions = function(data, ind){
    var discussionPicture;
    if(data.length){
        for(var x = 0;x < data.length;x++){
            var raw = data[x].message;
            var author = data[x].from;
            author = author.toString();
            var author2 = data[x]._id;
            author2 = author2.toString();
            var decoded = steem.memo.decode(ind.key, raw);
            var decodedFinal = decoded.split("");
            decodedFinal.shift();
            part = decodedFinal.slice(0, 34);
            var decodedFinal = part.join("") + "...";
            if(author == ind.id) {
                steem.api.getAccounts([author2], function(err, result) {
                    if(result.length > 0) {
                         meta = result[0].json_metadata;
                         if(meta !== "") {
                            meta = JSON.parse(meta)
                        }
                        else {
                            discussionPicture = "./images/nopic.png";
                        }
                        if(meta.profile !== undefined){
                            discussionPicture = meta.profile.profile_image;
                        }
                    }
                });
                var discussion = document.createElement('div');
                discussion.setAttribute('class', 'discussionOld');
                var discpicture = document.createElement("img");
                discpicture.setAttribute("src", discussionPicture);
                discpicture.setAttribute("height", "36");
                discpicture.setAttribute("width", "36");
                discpicture.setAttribute("style", "float:left;border-radius:50%;border-width:2px;bordercolor:#fff;margin-top: 12px;margin-left: 5px;margin-right: 5px;");
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
                steem.api.getAccounts([author], function(err, result) {
                    if(result.length > 0) {
                         meta = result[0].json_metadata;
                         if(meta !== "") {
                            meta = JSON.parse(meta)
                        }
                        else {
                            discussionPicture = "./images/nopic.png";
                        }
                        if(meta.profile !== undefined){
                            discussionPicture = meta.profile.profile_image;
                        }
                    }
                });
                var discussion = document.createElement('div');
                discussion.setAttribute('class', 'discussionNew');
                var discpicture = document.createElement("img");
                discpicture.setAttribute("src", discussionPicture);
                discpicture.setAttribute("height", "36");
                discpicture.setAttribute("width", "36");
                discpicture.setAttribute("style", "float:left;border-radius:50%;border-width:2px;bordercolor:#fff;margin-top: 12px;margin-left: 5px;margin-right: 5px;");
                discussion.appendChild(discpicture)
                discussion.addEventListener("click", (function(author) {
                    return function () {
                        client.fetchDiscussion({receiver: author});
                    }
                })(author));
                discussion.setAttribute('align', 'left');
                discussion.innerHTML = "<b>@" + author + "</b>" + " <br>" + decodedFinal;
                previousDiscussions.insertBefore(discussion, previousDiscussions.firstChild);
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
        notificationSound.play();
    }
    else{
    }
}
