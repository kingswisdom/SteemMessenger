var UI = require('./UIlib.js')

var chatOpen;
var emojiBoxOpen;

exports.switchAppDisplay = function(){
	if(chatOpen == 1){
		document.getElementById("DaChat").style.display = "none";
		$(".app").removeClass("full");
		chatOpen = 0;
	}
	else {
		chatOpen = 1;
		$(".app").addClass("full");
		document.getElementById("DaChat").style.display = "block";
	}
}

exports.switchEmojisBoxDisplay = function(){
	if(emojiBoxOpen == 1){
		document.getElementById("emoji-container").style.display = "none";
		$(".emojiBox").removeClass("full");
		emojiBoxOpen = 0;
	}
	else {
		emojiBoxOpen = 1;
		$(".emojiBox").addClass("full");
		document.getElementById("emoji-container").style.display = "block";
	}
}

exports.openSettings = function(data){
	UI.hideLoginSuccess();
	UI.showSettings(data);
}

exports.closeSettings = function(){
	UI.clearPreviousDiscussions();
	UI.hideSettings();
	UI.showLoginSuccess();
}

exports.onNotConnectedShowLoginInterface = function(){
	UI.hideSplash();
    UI.showLoginInterface();
}

exports.onFirstLoginShowPassphraseSelectorScreen = function(){
	UI.hideLoader1();
	UI.hideLoginInterface();
	UI.showPassphraseSelectorScreen();
}

exports.onLeakedKeyShowWarning = function(){
	UI.hideLoader1();
	UI.hideLoginInterface();
	UI.showLeakedKeyWarning();
}

exports.onNewPassphraseShowSuccessScreen = function(){
	UI.hideLoader4();
    UI.showPassphraseLoginBtn();
	UI.hidePassphraseSelectorScreen();
	UI.showLoginSuccess();
}

exports.onConnectedShowPassphraseLoginInterface = function(){
    UI.hideSplash();
    UI.showPassphraseLoginInterface();
    UI.hideLoader0();
    UI.showStartButton();	
}

exports.onPassphraseUnmatchShowError = function(){
    UI.hideLoader4();
    UI.showPassphraseLoginBtn();
    UI.showErrorPassphraseLoginBtn();	
}

exports.onValidPassphraseShowLoginSuccessScreen = function(){
    UI.hidePassphraseLoginInterface();
    UI.showLoginSuccess();
    UI.hideLoader5();
    UI.showPassphraseLoginBtn();
}

exports.returnToPreviousDiscussions = function(){
    UI.hideNotSubscribed();
    UI.clearPreviousDiscussions();
	UI.hideChatContainer();
	UI.hideReceiverInfo();
	UI.showLoginSuccess();
	UI.hideLoader3();
	UI.showChatTextInputArea();
	UI.clearChatTextInputArea();
	UI.clearMessages();
	UI.clearReceiverPicture();
	UI.clearReceiverInf();
}

exports.onNotSubscribed = function(data){
	document.getElementById("DaChat").style.display = "none";
	$(".app").removeClass("full");
	$(".app").addClass("subscription");
	UI.showNotSubscribed(data);
}

exports.onSendHideChatTextArea = function(){
    UI.hideChatTextInputArea();
	UI.showLoader3();
}

exports.onSentShowChatTextArea = function(){
    UI.showChatTextInputArea();
	UI.hideLoader3();
	UI.clearChatTextInputArea();
	UI.focusChatTextInputArea();
}

exports.showWhoIsWriting = function(data){
	UI.isWritingValue(data);
	UI.showIsWriting();
}

exports.hideWhoIsWriting = function(){
	UI.isWritingClearValue();
	UI.hideIsWriting();
}

