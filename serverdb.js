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
}

});
