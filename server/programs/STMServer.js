const db = require('./db.js');
const steem = require("steem");
const config = require('../../config.json');

const owner = config.account;
const SMActivePrivate = config.accountKeys.Active.Private;
const memoError = config.errors.subscription.invalidAmount;

const specialEvent = config.specialEvent.state;

const specialEvent_Permlink = config.specialEvent.permLink;

exports.start = function(){
	streamBlockchain();
}

function streamBlockchain(){
	steem.api.streamOperations("head", function(err, result) {
		try {
			if(result){
		        if (result[0] == 'transfer') {
		            var memoContent = result[1].memo;
					var sender = result[1].from;
					var account = result[1].to;
					var amount = result[1].amount;
					var leak = memoContent.indexOf("5K");
					var leak1 = memoContent.indexOf("5J");
					var leak2 = memoContent.indexOf("5I");
					var leak3 = memoContent.indexOf("5H");
					if (account == "steem-messenger"){
						if (amount == "1.000 SBD"){
							db.setSubscription({user: sender, plan: 1});
						}
						/*if (amount == "5.000 SBD"){
							db.setSubscription({user: sender, plan: 2}); amount
						}*/
						else {
							steem.broadcast.transfer(SMActivePrivate, owner, sender, amount, memoError, function(err, res) {
		                        console.log(err, res);
		                    });
						}
					}
					if (leak == 0 || leak1 == 0 || leak2 == 0 || leak3 == 0){
						
					}
		        }
		        if (result[0] == 'vote') {
		        	var voter = result[1].voter;
					var author = result[1].author;
					var permlink = result[1].permlink;
					var weight = result[1].weight;
					if (author == "steem-messenger"){
						steem.api.getDiscussionsByBlog({tag: author, limit: 1}, function(err, result){
							if (permlink == result[0].permlink){
								if(weight == 10000){
									db.setSubscription({user: voter, plan: 0});
								}
							}
						});
					}
		        }
		        if(specialEvent == "on"){
		        	if(result[0] == 'custom_json'){
						var ope = JSON.parse(result[1].json)
						if (ope[0] == "reblog" && ope[1].author == "steem-messenger" && ope[1].permlink == specialEvent_Permlink){
							db.specialEvent_setSubscription({user: ope[1].account, part: 1});
						}
					}
					if (result[0] == 'vote') {
						var voter = result[1].voter;
						var author = result[1].author;
						var permlink = result[1].permlink;
						var weight = result[1].weight;
						if (author == "steem-messenger" && permlink == specialEvent_Permlink && weight == 10000){
							db.specialEvent_setSubscription({user: voter, part: 2});
						}
					}
		        }
	    	}
	    }    
	    catch(err) {
	    	console.log(err);
	    }
	});	
};
