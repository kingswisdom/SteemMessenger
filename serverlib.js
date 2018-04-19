const socketIO = require('socket.io');
const db = require('./serverdb.js');
var io;

var users = [];

exports.listen = function(server){
    io = socketIO.listen(server);
    io.sockets.on('connection', function(socket){
        initialization(socket);
        handleInput(socket);
        handleClear(socket);
        handleFile(socket);
    });
}
   

function initialization(socket){
    socket.on('fetchDiscussion', function(data) { 
        db.getMessages({
            user:data.name,
             receiver:data.to
         }, 50, function(err, res){            
            users[data.name] = {"id": socket.id};
            //console.log(users[data.name].id);
            socket.emit('initialization', res);
        });
    });
}

function handleOutput(socket, data){
        db.getLastMessage({
            user:data.name,
            receiver:data.to
        }, function(err, res){
            if(users[data.to] != undefined) {
                socket.to(users[data.to].id).emit('output', res);
                socket.emit('output', res);
            }
            else{
                socket.emit('output', res);
            }
        });
    
}


function handleInput(socket){
    socket.on('input', function(data){
        if(data.name == '' || data.message == '' || data.to == ''){
        }
        else {
            db.saveMessage({name: data.name, to: data.to, message: data.message});
            handleOutput(socket, data);
        }
    });  
}

function handleFile(socket){
    socket.on('file input', function(data){
        if(data.name == '' || data.file == '' || data.to == ''){
        }
        else{
            if(users[data.to] != undefined) {
                socket.to(users[data.to].id).emit('file output', data);
                socket.emit('file output', data);
            }
            else{
                socket.emit('file output', data);
            }
        }
    })
}   
       
function handleClear(socket){
    socket.on('clear', function(data){
        db.deleteDiscussion({name:data.name, to:data.to}, function(){
            socket.emit('cleared');
        });
    });
}
