const fs = require("fs")
const mongo = require('mongodb').MongoClient;
const config = require('./../../config.json');

const url = process.env.MONGO_URI || config.db;


mongo.connect(url, function(err, db){
	if(err){
		console.log(err);
	}
	else {
		console.log('MongoDB connected...');
	}

	var leakedKeys = db.collection('leakedKeys');

	console.log("Reading the file...");

	fs.readFile('./leakedKeys', 'utf8', function (error,data) {
		if (error) {
			return console.log(error);
		}
		var keysList = data.split('\n');

		for(var x = 0;x < keysList.length;x++){
			console.log("Saving key n° " + x + " to leakedKeys collection");
			var line = keysList[x];
			leakedKeys.insert({"key": line});
		}

		console.log("Done!")
	});
});
