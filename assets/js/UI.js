var UI = require('./UIlib.js')



exports.onNotConnectedShowLoginInterface = function(){
	UI.hideSplash();
    UI.showLoginInterface();
}

exports.onFirstLoginShowPassphraseSelectorScreen = function(){
	UI.hideLoader1();
	UI.hideLoginInterface();
	UI.showPassphraseSelectorScreen();
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

