var element = function(id){
  return document.getElementById(id);
}

var DaChat = element('DaChat');
var returnToSelection = element('returnToSelection');
var messages = element('messages');
var textarea = element('textarea');
var username = element('username');
var privMemoKey = element('privMemoKey');
var newPassphrase = element('newPassphrase')
var newPassphrase2 = element('newPassphrase2');;
var passphraseUsername = element('passphraseUsername');
var passphraseLoginInterface = element('passphraseLoginInterface');
var passphrase = element('passphrase');
var passphraseLoginBtn = element('PassphraseLoginBtn');
var receiver = element('receiver');
var receiverInfo = element("receiver-info");
var clearBtn = element('clear');
var loginBtn = element('login');
var friendBtn = element('friend');
var startBtn = element('start');
var leakedWarning = element('leakedWarning');
var passphraseSelectorScreen = element('passphraseSelectorScreen');
var createPassphraseBtn = element("createPassphraseBtn");
var logsucc = element("login-success");
var splash = element("splash");
var notSubscribed = element("notSubscribed");
var loader0 = element("loaderEffect0");
var loader1 = element("loaderEffect1");
var loader2 = element("loaderEffect2");
var loader3 = element("loaderEffect3");
var loader4 = element("loaderEffect4");
var loader5 = element("loaderEffect5");
var loginter = element("login-interface");
var chatCont = element("chat-container");
var isWriting = element("isWriting");
var fileSend = element('fileSend');
var emojiList = element("emoji-list");
var emojiContainer = element("emoji-container");
var previousDiscussions = element("previousDiscussions");
var settingsInterface = element("settingsInterface");
var notificationSound = new Audio('./audio/light.mp3');

var exportWallet = element("exportWallet");

/*-------------------------------
------------Loaders--------------
-------------------------------*/

  exports.showLoader0 = function(){
    loader0.style.display = "block";
  }

  exports.hideLoader0 = function(){
    loader0.style.display = "none";
  }  

  exports.showLoader1 = function(){
    loader1.style.display = "block";
  }

  exports.hideLoader1 = function(){
    loader1.style.display = "none";
  }

  exports.showLoader2 = function(){
    loader2.style.display = "block";
  }

  exports.hideLoader2 = function(){
    loader2.style.display = "none";
  }

  exports.showLoader3 = function(){
    loader3.style.display = "block";
  }

  exports.hideLoader3 = function(){
    loader3.style.display = "none";
  }

   exports.showLoader4 = function(){
    loader4.style.display = "block";
  }

  exports.hideLoader4 = function(){
    loader4.style.display = "none";
  }

   exports.showLoader5 = function(){
    loader5.style.display = "block";
  }

  exports.hideLoader5 = function(){
    loader5.style.display = "none";
  }


/*-------------------------------
--------------Divs---------------
-------------------------------*/

  exports.showSplash = function(){
    splash.style.display = "block";
  } 

  exports.hideSplash = function(){
    splash.style.display = "none";
  } 

  exports.showLoginInterface = function(){
    loginter.style.display = "block";
  }

  exports.hideLoginInterface = function(){
    loginter.style.display = "none";
  }

  exports.showPassphraseLoginInterface = function(){
    passphraseLoginInterface.style.display = "block";
  }

  exports.hidePassphraseLoginInterface = function(){
    passphraseLoginInterface.style.display = "none";
  }

  exports.showPassphraseSelectorScreen = function(){
    passphraseSelectorScreen.style.display = "block";
  }

  exports.hidePassphraseSelectorScreen = function(){
    passphraseSelectorScreen.style.display = "none";
  }

  exports.showLoginSuccess = function(){
    logsucc.style.display = "block";
  }

  exports.hideLoginSuccess = function(){
    logsucc.style.display = "none";
  }

  exports.showLeakedKeyWarning = function(){
    leakedWarning.style.display = "block";
  }

  exports.hideLeakedKeyWarning = function(){
    leakedWarning.style.display = "none";
  }

  exports.showChatContainer = function(){
    chatCont.style.display = "block";
  }

  exports.hideChatContainer = function(){
    chatCont.style.display = "none";
  }

  exports.showReceiverInfo = function(){
    receiverInfo.style.display = "block";
  }

  exports.hideReceiverInfo = function(){
    receiverInfo.style.display = "none";
  }

  exports.clearPreviousDiscussions = function(){
    previousDiscussions.innerHTML = "";
  }

  exports.showNotSubscribed = function(data){
    notSubscribed.innerHTML = '<h2>Not subscribed ?</h2><p>In order to send messages, you need to pick up a paid plan.</p><div class="expanded landing__section" style="padding: 11pt 0;"><div class="container"><div class="steps__inner"><div class="step"><div class="price-box" style="width:194px; height: 350px;"><h2 class="pricing-plan">Starter</h2><div class="price">1<small> upvote/week</small></div><hr><ul class="pricing-info"><li>Maximum security</li><li>100 Kb max/file transfer</li></ul><a target="_blank" rel="noopener noreferrer" href="https://steemconnect.com/sign/vote?from='+data.id+'&author=steem-messenger&permlink='+data.permlink+'" class="button hero__buttonblack">Get started</a></div></div><div class="step"><div class="price-box popular" style="width:194px; height: 350px;"><div class="popular-text" style="left: 44%;">Popular</div><h2 class="pricing-plan">Regular</h2><div class="price"><sup class="currency">SBD</sup>1<small>/month</small></div><hr><ul class="pricing-info"><li>Access to special events</li><li>2 Mb max/file transfer</li></ul><a target="_blank" rel="noopener noreferrer" href="https://steemconnect.com/sign/transfer?from='+data.id+'&to=steem-messenger&amount=1.000%20SBD" class="button button__accent">Get started</a></div></div><div class="step"><div class="price-box" style="width:194px; height: 350px;"><h2 class="pricing-plan">Plus</h2><div class="price"><sup class="currency">SBD</sup>5<small>/month</small></div><hr><ul class="pricing-info"><li>Developers API</li><li>10 Mb max/file transfer</li></ul><a target="_blank" rel="noopener noreferrer" href="https://steemconnect.com/sign/transfer?from='+data.id+'&to=steem-messenger&amount=5.000%20SBD" class="button hero__buttonblack">Get started</a></div></div></div></div></div></div>'
    notSubscribed.style.display = "block";
  }

  exports.hideNotSubscribed = function(){
    notSubscribed.style.display = "none";
  }

  exports.showSettings = function(data){
    settingsInterface.style.display = "block";
    exportWallet.value = "";
    exportWallet.value = data;
  }
  
  exports.hideSettings = function(){
    settingsInterface.style.display = "none";
  }
/*-------------------------------
------------Buttons--------------
-------------------------------*/

  exports.showErrorPassphraseLoginBtn = function(){
    passphraseLoginBtn.innerHTML = "Try again !";
  }

  exports.hideErrorPassphraseLoginBtn = function(){
    passphraseLoginBtn.innerHTML = "Unlock Session";
  }

  exports.showErrorLoginBtn = function(){
    loginBtn.innerHTML = "Error !";
  }

  exports.hideErrorLoginBtn = function(){
    loginBtn.innerHTML = "Log in";
  }

  exports.showErrorCreatePassphraseBtn = function(){
    createPassphraseBtn.innerHTML = "Error !";
  }

  exports.hideErrorCreatePassphraseBtn = function(){
    createPassphraseBtn.innerHTML = "Go !";
  }

  exports.showStartButton = function(){
    startBtn.style.display = "block";
  } 

  exports.hideStartButton = function(){
    startBtn.style.display = "hide";
  }

  exports.showLoginBtn = function(){
    loginBtn.style.display = "block";
  } 

  exports.hideLoginBtn = function(){
    loginBtn.style.display = "hide";
  }

  exports.showPassphraseLoginBtn = function(){
    passphraseLoginBtn.style.display = "block";
  } 

  exports.hidePassphraseLoginBtn = function(){
    passphraseLoginBtn.style.display = "hide";
  }


/*-------------------------------
------------Inputs---------------
-------------------------------*/

  

  exports.showChatTextInputArea = function(){
    textarea.style.display = "block";
  }

  exports.hideChatTextInputArea = function(){
    textarea.style.display = "none";
  }  

  exports.clearChatTextInputArea = function(){
    textarea.value = "";
  }

  exports.focusChatTextInputArea = function(){
    textarea.focus();
  }

  exports.clearMessages = function(){
    messages.innerHTML = "";
  }

  exports.clearReceiverPicture = function(){
    document.getElementById('receiverpicture').remove();
  }

  exports.clearReceiverInf = function(){
    document.getElementById('receiverInf').remove();
  }

    
/*-------------------------------
--------------Miscs--------------
-------------------------------*/    

  exports.notification = function(){
    notificationSound.play();
  }

  exports.showIsWriting = function(){
    isWriting.style.display = "inline";
  }

  exports.hideIsWriting = function(){
    isWriting.style.display = "none";
  }

  exports.isWritingValue = function(data){
    isWriting.innerHTML = "@" + data.user + " is writing...";
  }

  exports.isWritingClearValue = function(){
    isWriting.innerHTML = "";
  }
