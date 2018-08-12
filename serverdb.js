const mongo = require('mongodb').MongoClient;
const url = process.env.MONGO_URI || "mongodb://127.0.0.1/steemMessenger";

mongo.connect(url, function(err, db){
    if(err){
        console.log(err);
    }
    else {
    console.log('MongoDB connected...');
    }


var chat = db.collection('chats');
var latestMessages = db.collection('latestMessages');
var subscriptions = db.collection('subscriptions');

exports.getMessages = function(data, limit, out){
	var query = chat.find({tags: { $all: [data.user, data.receiver]}});
	query.limit(limit).sort({timestamp:1}).toArray(function(err, res){
		console.log
    	out(err, res);
	});
}

exports.getLastMessage = function(data, out){
	var query = chat.find({tags: { $all: [data.user, data.receiver]}});
	query.limit(1).sort({timestamp:-1}).toArray(function(err, res){
		out(err, res);
	});
}

exports.getLatestMessages = function(data, out){
    var query = latestMessages.find({tags: { $all: [data.user]}});
    query.limit(50).sort({timestamp:1}).toArray(function(err, res){
            out(err, res);
    });
}

exports.saveMessage = function(data){
	chat.insert({
		"from": data.name,
		"to": data.to,
		"tags": [data.name, data.to],
		"message": data.message,
		"timestamp": Date.now()
	});
    latestMessages.remove({from:data.name, to:data.to});
    latestMessages.remove({from:data.to, to:data.name});
    latestMessages.insert({
        "from": data.name,
        "to": data.to,
        "tags": [data.name, data.to],
        "message": data.message,
        "timestamp": Date.now()
    });
}

exports.deleteDiscussion = function(data){
	chat.remove({from:data.name, to:data.to});
    latestMessages.remove({from:data.name, to:data.to});
}

exports.setSubscription = function(data){
    subscriptions.remove({name: data.name});
    subscriptions.insert({
        "name": data.name,
        "plan": data.plan,
        "timestamp": Date.now(),
        "end": Date.now() + 2678400000 //TODO : make this time a variable (in order to change it dynamically for different paid plans)
    })
}

exports.checkSubscription = function(data, out){
    var query = subscriptions.find({name: data.name});
    query.limit(1).sort({timestamp:1}).toArray(function(err,res){
        console.log(res)
        out(res);
    })
}
});
