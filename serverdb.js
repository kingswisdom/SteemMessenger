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
    chat.aggregate([
    	{$match: 
    		{from: data.user}
    	},
    	{$sort: {
    		_id:-1
    	}},
    	{$group: {
    		_id: "$to",
    		from: {$first: "$from"},
    		message: {$first: "$message"},
    		timestamp: { $first: "$timestamp" }
    	}}
    ]).toArray(function(err, res){
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
}

exports.deleteDiscussion = function(data){
	chat.remove({from:data.name, to:data.to});
}

});
