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
	query.limit(limit).sort({_id:1}).toArray(function(err, res){
    	out(err, res);
	});
}

exports.getLastMessage = function(data, out){
	var query = chat.find({tags: { $all: [data.user, data.receiver]}});
	query.limit(1).sort({_id:-1}).toArray(function(err, res){
		out(err, res);
	});
}

exports.saveMessage = function(data){
	console.log(data);
	chat.insert({
		"tags": [data.name, data.to], 
		"author": data.name, 
		"message": data.message,
		"timestamp": Date.now()
	});
}

exports.deleteDiscussion = function(data){
	chat.remove({tags: { $all: [data.name, data.to]}});
}

});
