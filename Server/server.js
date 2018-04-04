const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;

// Connect to mongo
var url = process.env.MONGO_URI || "mongodb://127.0.0.1/steemMessenger";
mongo.connect(url, function(err, db){
    if(err){
        throw err;
    }

    console.log('MongoDB connected...');

    // Connect to Socket.io
    client.on('connection', function(socket){
        let chat = db.collection('chats');

        // Create function to send status
        sendStatus = function(s){
            socket.emit('status', s);
        }
       

        // Get chats from mongo collection when logged in
    
        socket.on('logged', function(info) { 
            let user = info.name;
            let receiver = info.to;

            chat.find({tags: { $all: [user, receiver]}}).limit(50).sort({_id:1}).toArray(function(err, res){
                if(err){
                    throw err;
                }
         
          
                // Emit the messages
                socket.emit('output', res);
            
            
            });
   
            // Handle input events
            socket.on('input', function(data){
                let name = data.name;
                let message = data.message;
                let to = data.to;
                    // Check for name and message
                    if(name == '' || message == '' || to == ''){
                    // Send error status
                    sendStatus('Input is missing !');
                    }  
                    else {                
                    // Insert message
                    chat.insert({"tags": [name, to], "author": name, "message": message}, function(){
                   
                        if(name == receiver || name == user) {
                            client.emit('output', 
                                [
                                    {
                                        tags:[name, to],
                                        author:name,
                                        message:message
                                    }
                                ]
                            );
                        }

                        // Send status object
                        sendStatus(
                            {
                                message: 'Message sent',
                                clear: true
                            }
                        );
                    });
                }
            });

            // Handle clear
            socket.on('clear', function(data){
                // Remove all chats from collection
                chat.remove({tags: { $all: [user, receiver]}}, function(){
                    // Emit cleared
                    socket.emit('cleared');
                });
            });
        }); 
    });
});