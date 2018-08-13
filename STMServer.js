const db = require('./serverdb.js');
const steem = require("steem");

const owner = "steem-messenger";
const memoError = "Invalid amount : Send 1 or 5 SBD to complete your subscription. Please refer to our website for pricing";

const specialEvent = "off";

const specialEvent_Permlink = "";

exports.start = function(){
	streamBlockchain();
}

function streamBlockchain(){
	steem.api.streamOperations("head", function(err, result) {
		try {
			if(result.length){
		        if (result[0] == 'transfer') {
		            var memoContent = result[1].memo;
					var sender = result[1].from;
					var account = result[1].to;
					var amount = result[1].amount;
					if (account == "steem-messenger"){
						if (amount == "1.000 SBD"){
							console.log(account + " has subscribed");
							db.setSubscription({name: sender, plan: 1});
						}
						/*if (amount == "5.000 SBD"){
							db.setSubscription({name: sender, plan: 2}); amount
						}*/
						else {
							steem.broadcast.transfer(SMActivePrivate, owner, sender, amount, memoError, function(err, res) {
		                        console.log(err, res);
		                    });
						}
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
									db.setSubscription({name: voter, plan: 0});
								}
							}
						});
					}
		        }
		        if(specialEvent == "on"){
		        	if(result[0] == 'custom_json'){
						var ope = JSON.parse(result[1].json)
						if (ope[0] == "reblog" && ope[1].author == "steem-messenger" && ope[1].permlink == specialEvent_Permlink){
							console.log()
						}
			}
		        }
	    	}
	    }    
	    catch(err) {
	    	console.log(err);
	    	process.exit(1);
	    }
	});	
};
