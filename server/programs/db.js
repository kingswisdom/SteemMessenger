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
        subscriptions.remove({user: data.user});
        if(data.plan == 0){
            subscriptions.insert({
            "user":         data.user,
            "plan":         data.plan,
            "timestamp":    Date.now(),
            "end":          Date.now() + 669600000
            });
        }
        if(data.plan == 1){
            subscriptions.insert({
            "user":         data.user,
            "plan":         data.plan,
            "timestamp":    Date.now(),
            "end":          Date.now() + 2678400000
            });
        }
        if(data.plan == 2){
            subscriptions.insert({
            "user":         data.user,
            "plan":         data.plan,
            "timestamp":    Date.now(),
            "end":          Date.now() + 2678400000
            });
        }    
    }

    exports.checkSubscription = function(data, out){
        var query = subscriptions.find({user: data.user});
        query.limit(1).sort({timestamp:1}).toArray(function(err,res){
            console.log(res)
            out(res);
        });
    }

    exports.specialEvent_setSubscription = function(data){
        var query = subscriptions.find({user: data.user});
        query.limit(1).sort({timestamp:1}).toArray(function(err,res){
            if(i < 101){
                if(res.state == undefined && res.plan == undefined){
                    subscriptions.insert({
                        "user":         data.user,
                        "state":        data.state
                    });
                } 
                if(res.state == 1 && res.plan == undefined){
                    subscriptions.remove({user: data.user})
                    subscriptions.insert({
                        "user":         data.user,
                        "plan":         data.plan,
                        "timestamp":    Date.now(),
                        "end":          Date.now() + 2678400000
                    });
                    i++;
                }    
            }  
        });
         
    }

    exports.checkIfLeakedKey = function(data, out){
        var query = leakedKeys.find({user: data.user});
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
            "user":     data.to,
            "to":       data.user
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
});
