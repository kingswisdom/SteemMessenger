const socketIO = require('socket.io');
const db = require('./serverdb.js');
const Lara = require('./Lara.js');

var io;

var users = [];

exports.listen = function(server){
    io = socketIO.listen(server);
    io.sockets.on('connection', function(socket){
        initialization(socket);
        reinitialization(socket);
        fetchDiscussion(socket);
        handleInput(socket);       
        handleFile(socket);        
        fetchDiscussions(socket);
        handleClear(socket);
        onIsWriting(socket);
        checkSubscription(socket);
    });
}
   
function initialization(socket){
    socket.on('initialize', function(data){
        Lara.checkLogin({encodedmsg: data.encodedmsg}, function(out){
            users[out.name] = {"id": socket.id};
            console.log(out.name + " is connected !");
            socket.emit('logged');
            return handleLatestDiscussions(socket, {name: out.name});
        })
        
    });
}

function reinitialization(socket){
    socket.on('reinitialize', function(data){
        Lara.checkLogin({encodedmsg: data.encodedmsg}, function(out){
            users[out.name] = {"id": socket.id};
            console.log(out.name + " is connected !");
            return handleLatestDiscussions(socket, {name: out.name});
        })
        
    });
}

function fetchDiscussion(socket){
    socket.on('fetchDiscussion', function(data) { 
        Lara.processRequest(data, function(out){
            db.getMessages({user:out.name,receiver:out.to}, 50, function(err, res){
                //TODO : add function to encrypt res before sending it to client
                return socket.emit('output', res);
            });
        });
        
    });
}

function handleOutput(socket, out){
        db.getLastMessage({user:out.name, receiver:out.to}, function(err, res){
            if(users[out.to] != undefined) {
                socket.to(users[out.to].id).emit('output', res);
                return socket.emit('output', res);
            }
            else{
                return socket.emit('output', res);
            }
        });
    
}

function handleInput(socket){
    socket.on('input', function(data){
        if(data.message == ''){
            return
        }
        else {
            Lara.checkIdentity(data, function(out){
                if(out != undefined) {
                    console.log("Incoming message from @" + out.name + " to @" + out.to);
                    db.saveMessage({name: out.name, to: out.to, message: out.message});
                    return handleOutput(socket, out);
                }
                else {
                }                
            });            
        }
    });  
}

function handleFile(socket){
    socket.on('file input', function(data){
        if(data.name == '' || data.file == '' || data.to == ''){
            return
        }
        else{
            if(users[data.to] != undefined) {
                socket.to(users[data.to].id).emit('file output', data);
                return socket.emit('file output', data);
            }
            else{
                return socket.emit('file output', data);
            }
        }
    })
}   

function fetchDiscussions(socket){
    socket.on('fetchDiscussions', function(data){
        return handleLatestDiscussions(socket, data);
    });
}
       
function handleClear(socket){
    socket.on('clear', function(data){
        db.deleteDiscussion({name:data.name, to:data.to}, function(){
            return socket.emit('cleared');
        });
    });
}

function handleLatestDiscussions(socket, data){
    db.getLatestMessages({user:data.name}, function(err, res){
        if(res.length){
            return socket.emit('latest discussions', res);
        }        
    });
}

function onIsWriting(socket){
    socket.on('is writing', function(data){
        if(users[data.to] != undefined) {
                socket.to(users[data.to].id).emit('recipient is writing', data);
            }
            else{
            }

    })
}

function checkSubscription(socket){
    socket.on('checkSubscription', function(data){
        db.checkSubscription(data, function(err, res){
            if (res.length){
                var timeLeft = res.end - Date.now();
                if(res.name == data.name && timeLeft > 0){
                    socket.emit('time left', {end: timeLeft});
                }
                else{
                    socket.emit('subscription ended', {end: res.end});
                }
            }
        })
    })
}

//TODO : add an encrypt function that will be called before each socket.emit
