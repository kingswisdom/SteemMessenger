const steem = require("steem");

var element = function(id){
    return document.getElementById(id);
}

var messages = element('messages');
var textarea = element('textarea');
var receiverInfo = element("receiver-info");
var logsucc = element("login-success");
var loader1 = element("loaderEffect");
var loader2 = element("loaderEffect2");
var loader3 = element("loaderEffect3");
var loginter = element("login-interface");
var chatCont = element("chat-container");
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
    var user = data.user;
    steem.api.getAccounts([user], function(err, result) {
        if(result.length > 0) {
            privWif = data.privWif;
            pubWif = result[0]["memo_key"];
            var isvalid = steem.auth.wifIsValid(privWif, pubWif);
            console.log(isvalid);
            if(isvalid == true){
                var privateMemoKey = privWif;
                out({key:privateMemoKey, user:user});
                loader1.style.display = "none";
                loginter.style.display = "none";
                logsucc.style.display = "block";
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
                receiverPicture = "https://image.noelshack.com/fichiers/2018/06/6/1518257301-question-mark-1751308-640.png"
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
    receiver = data.receiver;
    steem.api.getAccounts([receiver], function(err, result) {
        if(result.length > 0) {
            publicMemoReceiver = result[0]["memo_key"];
            texte = "#" + data.message;
            privateMemoKey = data.key;
            var encoded = steem.memo.encode(privateMemoKey, publicMemoReceiver, texte);
            out({encodedmsg: encoded});
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
        var author = data[x].author;
        author1 = author.toString();
        var decoded = steem.memo.decode(ind.key, raw);
        var decodedFinal = decoded.split("");
        decodedFinal.shift();
        var decodedFinal = decodedFinal.join("");
        if(author1 == ind.id) {
            var message = document.createElement('div');
            message.setAttribute('class', 'msg-containerblue'); 
            message.setAttribute('align', 'right');
            var messageText = document.createElement('div');
            messageText.setAttribute('align', 'left');                              
            messageText.textContent = decodedFinal;
            messages.appendChild(message);
            message.appendChild(messageText);
            messages.scrollTop = messages.scrollHeight;
            //messages.insertBefore(message, messages.firstChild);
        }
        if(author1 == ind.receiver) {
            var message = document.createElement('div');
            message.setAttribute('class', 'msg-container'); 
            message.setAttribute('align', 'left');                                          
            message.textContent = decodedFinal;
            messages.appendChild(message);
            messages.scrollTop = messages.scrollHeight;
            notificationSound.play();
            //messages.insertBefore(message, messages.firstChild);
        }
        else {
        }
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

    console.log(decodedFinal);
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
