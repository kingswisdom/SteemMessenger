const mongo     = require('mongodb').MongoClient;
const config    = require('../../config.json');

const url       = process.env.MONGO_URI || config.db;

var i;

mongo.connect(url, function(err, db){
    if(err){
        console.log(err);
    }
    else {
        console.log('MongoDB connected...');
    }


    var chat                = db.collection('chats');
    var latestMessages      = db.collection('latestMessages');
    var subscriptions       = db.collection('subscriptions');
    var leakedKeys          = db.collection('leakedKeys');
    var blacklist           = db.collection('blacklist');
    var whitelist           = db.collection('whitelist');
    var specialEvent1       = db.collection('specialEvent1');

    exports.getMessages = function(data, limit, out){
    	var query = chat.find({tags: { $all: [data.user, data.receiver]}});
    	query.limit(limit).sort({timestamp:1}).toArray(function(err, res){
    		console.log(res)
        	out(err, res);
    	});
    }

    exports.getLastMessage = function(data, out){
    	var query = chat.find({tags: { $all: [data.user, data.receiver]}});
    	query.limit(1).sort({timestamp:-1}).toArray(function(err, res){
            console.log(res)
    		out(err, res);
    	});
    }

    exports.getLatestMessages = function(data, out){
        var query = latestMessages.find({tags: { $all: [data.user]}});
        query.limit(50).sort({timestamp:1}).toArray(function(err, res){
            console.log(res)
            out(err, res);
        });
    }

    exports.saveMessage = function(data){
    	chat.insert({
    		"from":         data.user,
    		"to":           data.to,
    		"tags":         [data.user, data.to],
    		"message":      data.message,
    		"timestamp":    Date.now()
    	});
        latestMessages.remove({from:data.user, to:data.to});
        latestMessages.remove({from:data.to, to:data.user});
        latestMessages.insert({
            "from":         data.user,
            "to":           data.to,
            "tags":         [data.user, data.to],
            "message":      data.message,
            "timestamp":    Date.now()
        });
    }

    exports.deleteDiscussion = function(data){
    	chat.remove({from:data.user, to:data.to});
        latestMessages.remove({from:data.user, to:data.to});
    }

    exports.setSubscription = function(data){
        var query = subscriptions.find({user: data.user});
        query.limit(1).sort({timestamp:1}).toArray(function(err,res){
            if(res.user == undefined){ //If never subscribed
                if(data.plan == 0){ //Upvote plan
                    subscriptions.insert({
                    "user":         data.user,
                    "plan":         data.plan,
                    "timestamp":    Date.now(),
                    "end":          Date.now() + 669600000
                    });
                }
                if(data.plan == 1){ //1 SBD plan
                    subscriptions.insert({
                    "user":         data.user,
                    "plan":         data.plan,
                    "timestamp":    Date.now(),
                    "end":          Date.now() + 2678400000
                    });
                }
                if(data.plan == 2){ //5 SBD plan
                    subscriptions.insert({
                    "user":         data.user,
                    "plan":         data.plan,
                    "timestamp":    Date.now(),
                    "end":          Date.now() + 2678400000
                    });
                }    
            }
            if(res.end >= Date.now() && data.plan >= 1){ //If subscription not ended yet, and user choose to send some more sbd. The last one is to protect from accumulating subscriptions by upvoting our previous posts
                subscriptions.update(
                    {'user':data.user},
                    {$set:
                        {
                            'plan': data.plan , 
                            'timestamp': Date.now(), 
                            'end': res.end + 2678400000
                        }
                    }
                );
            }
            if(res.end <= Date.now()){ //If subscription ended
                subscriptions.remove({user: data.user}); //Delete previous subscription, then create a new one
                if(data.plan == 0){ //Upvote plan
                    subscriptions.insert({
                    "user":         data.user,
                    "plan":         data.plan,
                    "timestamp":    Date.now(),
                    "end":          Date.now() + 669600000
                    });
                }
                if(data.plan == 1){ //1 SBD plan
                    subscriptions.insert({
                    "user":         data.user,
                    "plan":         data.plan,
                    "timestamp":    Date.now(),
                    "end":          Date.now() + 2678400000
                    });
                }
                if(data.plan == 2){ //5 SBD plan
                    subscriptions.insert({
                    "user":         data.user,
                    "plan":         data.plan,
                    "timestamp":    Date.now(),
                    "end":          Date.now() + 2678400000
                    });
                }    
            }
        });        
    }

    exports.checkSubscription = function(data, out){
        var query = subscriptions.find({user: data.user});
        query.limit(1).sort({timestamp:1}).toArray(function(err,res){
            console.log(res)
            out(res);
        });
    }

    exports.checkIfLeakedKey = function(data, out){
        var query = leakedKeys.find({key: data.key});
        query.limit(1).toArray(function(err,res){
            if(res.length){
                out(res);
            }
            else{
                out("not leaked");
            }
        });
    }

    exports.addToBlacklist = function(data){
            blacklist.insert({
                "user":     data.blacklist, //The user that has been blacklisted
                "to":       data.user 
            });
    }

    exports.deleteBlacklist = function(data){
        blacklist.remove({to:data.user});
    }

    exports.addToWhitelist = function(data){
            whitelist.insert({
                "user":     data.whitelist, //The user that has been whitelisted
                "to":       data.user
            });
    }

    exports.checkIfWhitelisted = function(data, out){
        var query = whitelist.find({user: data.user, to: data.to});
        query.limit(1).sort({timestamp:1}).toArray(function(err,res){
            console.log(res)
            if(res){
                out("yes");
            }
            else{
                out("no");
            }
        });
    }

    exports.checkIfBlacklisted = function(data, out){
        var query = blacklist.find({user: data.user, to: data.to});
        query.limit(1).sort({timestamp:1}).toArray(function(err,res){
            if(res.length){
                out("yes");
            }
            else{
                out("no");
            }
        });
    }

    /*#################################################
    ###################SPECIAL EVENT###################
    ###################################################*/

    exports.specialEvent_setSubscription_66PercentPromotion = function(data){
        var query = subscriptions.find({user: data.user});
        query.limit(1).sort({timestamp:1}).toArray(function(err,res){
            if(res.user == undefined){                
                if(data.plan == 1){ //1 SBD plan
                    subscriptions.insert({
                    "user":         data.user,
                    "plan":         data.plan,
                    "timestamp":    Date.now(),
                    "end":          Date.now() + 8035200000
                    });
                }
            }
        });
         
    }

    exports.specialEvent_setSubscription_33PercentPromotion = function(data){
        var query = subscriptions.find({user: data.user});
        query.limit(1).sort({timestamp:1}).toArray(function(err,res){
            if(res.user == undefined){                
                if(data.plan == 1){ //1 SBD plan
                    subscriptions.insert({
                    "user":         data.user,
                    "plan":         data.plan,
                    "timestamp":    Date.now(),
                    "end":          Date.now() + 4017600000
                    });
                    specialEvent1.insert({"user": data.user});
                }
            }
        });
         
    }

    exports.specialEvent_checkIfThereIsFreeSlots = function(out){
        var query = specialEvent1.find();
        query.toArray(function(err, res){
            out(res)
        });
    }
});
