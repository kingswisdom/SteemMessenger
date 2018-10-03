const db 			= require('./db.js');
const steem 			= require("steem");
const config 			= require('../../config.json');

const owner 			= config.account;
const SMActivePrivate 		= config.accountKeys.Active.Private;
const memoError 		= config.errors.subscription.invalidAmount;

var specialEvent 		= config.specialEvent.state;

var specialEvent_Permlink 	= config.specialEvent.permLink;

exports.start = function(){ streamBlockchain(); }

function streamBlockchain(){
	steem.api.streamOperations("head", function(err, result) {
		try {
			if(result){
		        if (result[0] == 'transfer') {
		        	var memoContent = result[1].memo;
				var sender 	= result[1].from;
				var account 	= result[1].to;
				var amount 	= result[1].amount;
				/*var leak 	= memoContent.indexOf("5K");
				var leak1 	= memoContent.indexOf("5J");
				var leak2 	= memoContent.indexOf("5I");
				var leak3 	= memoContent.indexOf("5H");*/
				if (account == "steem-messenger"){

					if(specialEvent == "on"){
						if(amount == "1.000 SBD" || amount == "1.000 STEEM"){
							db.specialEvent_checkIfThereIsFreeSlots(function(out){
								if(out.length < 100){
									db.specialEvent_setSubscription_66PercentPromotion({user: sender, plan: 1});
								}
								if(out.length >= 100 && out.length < 1000){
									db.specialEvent_setSubscription_33PercentPromotion({user: sender, plan: 1});
								}
								if(out.length >= 1000){
									db.setSubscription({user: sender, plan: 1});
								}
							});
						}
						if(amount == "5.000 SBD" || amount == "5.000 STEEM"){

						}
						if(amount == "8.000 SBD" || amount == "8.000 STEEM"){
							
						}
						if(amount == "15.000 SBD" || amount == "15.000 STEEM"){
							
						}
						if(amount == "26.000 SBD" || amount == "26.000 STEEM"){
							
						}
						if(amount == "50.000 SBD" || amount == "50.000 STEEM"){
							
						}
						if(amount == "100.000 SBD" || amount == "100.000 STEEM"){
							
						}
						if(amount == "200.000 SBD" || amount == "200.000 STEEM"){
							
						}
						
					}

					if(specialEvent == "off"){

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
				}
				/*if (leak == 0 || leak1 == 0 || leak2 == 0 || leak3 == 0){
					
				}*/ //TODO: Automatically scan the blockchain for new leaked keys, and store them in database
		        }
		        if (result[0] == 'vote') {
		        	var voter = result[1].voter;
					var author 	= result[1].author;
					var permlink 	= result[1].permlink;
					var weight 	= result[1].weight;
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
		       
	    	}
	    }    
	    catch(err) {
	    	console.log(err);
	    }
	});	
};
