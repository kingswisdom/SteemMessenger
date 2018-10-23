const socketIO      = require('socket.io');
const db            = require('./programs/db.js');
const Lara          = require('./programs/Lara.js');
/*const api_io        = require('socket.io-client');


var api_socket  = api_io.connect("http://127.0.0.1:3000");*/
var io;

var users           = [];
var users_sockets   = [];

exports.listen = function(server){
    io = socketIO.listen(server);
    io.origins(['http://127.0.0.1:4000']);
    io.sockets.on('connection', function(socket){
        initialization(socket);
        reinitialization(socket);
        SafeSocket(socket);
    });
}



function SafeSocket(socket){
    socket.on('safeSocket', function(data){
        var username = users_sockets[socket.id].name;
        Lara.decodeSafeSocket(data, username, function(out){
            if(out == undefined){
                return
            }
            if(out.error == "leaked"){
                Lara.encodeSafeSocket({request: "leaked", identity: out.user, user: out.user}, function(res){
                    return socket.emit('safeSocket', res);
                });
            }
            if(out.request != undefined){
                switch(out.request) {
                    case "getDiscussion":
                        return getDiscussion(out, socket);

                    case "getDiscussions":
                        return getDiscussions(out, socket);

                    case "input":
                        return handleInput(out, socket);

                    case "file input":
                        return handleFile(out, socket);

                    case "clear":
                        return handleClear(out, socket);

                    /*case "is writing":
                        return onIsWriting(out, socket);*/

                    case "add to blacklist":
                        return addToBlacklist(out, socket);

                    case "delete blacklist":
                        return deleteBlacklist(out, socket);

                    case "switch whitelist":
                        return switchWhitelist(out, socket);

                    case "check if whitelist is activated":
                        return checkIfWhitelistIsActivated(out, socket);

                    case "add to whitelist":
                        return addToWhitelist(out, socket);

                    case "delete whitelist":
                        return deleteWhitelist(out, socket);
                }
            }
        });
    });
}  

function initialization(socket){
    socket.on('initialize', function(data){
        Lara.checkLogin({encodedmsg: data.encodedmsg}, function(out){
            if(out.error == "leaked"){
                Lara.encodeSafeSocket({request: "leaked", identity: out.user, user: out.user}, function(res){
                    return socket.emit('safeSocket', res);
                });
            }
            if(out == undefined){

            }
            else{
                users[out.user]             = {"id": socket.id};
                users_sockets[socket.id]    = {"name": out.user};                
                Lara.encodeSafeSocket({request: "logged", identity: out.user, user: out.user}, function(res){
                    socket.emit('safeSocket', res);
                    return handleLatestDiscussions({user: out.user}, socket);
                });
            }

                        
        })
        
    });
}

function reinitialization(socket){
    socket.on('reinitialize', function(data){
        Lara.checkLogin({encodedmsg: data.encodedmsg}, function(out){
            if(out.error == "leaked"){
                Lara.encodeSafeSocket({request: "leaked", identity: out.user, user: out.user}, function(res){
                    return socket.emit('safeSocket', res);
                });
            }
            if(out == undefined){
                return
            }
            else{
                users[out.user]             = {"id": socket.id};
                users_sockets[socket.id]    = {"name": out.user};
                return handleLatestDiscussions({user: out.user}, socket);
            }
    
        })
        
    });
}

function getDiscussion(data, socket){
    db.getMessages({user:data.user,receiver:data.to}, 50, function(err, res){
        Lara.encodeSafeSocket({request: "output", identity: data.user, user: data.user, message: res}, function(out){
            return socket.emit('safeSocket', out);
        });        
    });
}

function handleInput(data, socket){
    db.checkSubscription({user: data.user}, function(res){
        if(res.length > 0 && res[0].user != undefined && res[0].end >= Date.now()){ //If subscribed
            db.checkIfWhitelistIsActive(data, function(result){
                if(result == true){
                    db.checkIfWhitelisted(data, function(output){
                        if(output == "yes"){
                            db.saveMessage({user: data.user, to: data.to, message: data.message});
                            return handleOutput(data, socket);
                        }
                        if(output == "no"){
                            Lara.encodeSafeSocket({request: "blacklisted", identity: data.user, user: data.user, to: data.to}, function(out){
                                return socket.emit("safeSocket", out);
                            });
                        }
                    });
                }
                if(result == false){
                    db.checkIfBlacklisted({user: data.user, to: data.to}, function(res2){
                        if(res2 == "no"){
                            db.saveMessage({user: data.user, to: data.to, message: data.message});
                            return handleOutput(data, socket);
                        }
                        if(res2 == "yes"){
                            Lara.encodeSafeSocket({request: "blacklisted", identity: data.user, user: data.user, to: data.to}, function(out){
                                return socket.emit("safeSocket", out);
                            });
                        }
                    });
                }
            });

        }
        else{ //If not subscribed
            Lara.encodeSafeSocket({request: "not subscribed", identity: data.user, user: data.user}, function(out){
                return socket.emit("safeSocket", out);
            });
        }
    });
}

function handleFile(data, socket){
    db.checkSubscription({user: data.user}, function(res){
        if(res.length > 0 && res[0].user != undefined && res[0].end >= Date.now()){
            if(users[data.to] != undefined) {
                Lara.encodeSafeSocket({request: "file output", identity: data.user, user: data.user, to: data.to, message: data.message}, function(out){
                    socket.emit("safeSocket", out);
                });
                Lara.encodeSafeSocket({request: "file output", identity: data.to, user: data.user, to: data.to, message: data.message}, function(out){
                    return socket.to(users[data.to].id).emit("safeSocket", out);
                });
            }
            else{
                Lara.encodeSafeSocket({request: "file output", identity: data.user, user: data.user, to: data.to, message: data.message}, function(out){
                    return socket.emit("safeSocket", out);
                });
            }
        }
        else{
            Lara.encodeSafeSocket({request: "not subscribed", identity: data.user, user: data.user}, function(out){
                return socket.emit("safeSocket", out);
            });
        }
    });
}   

function getDiscussions(data, socket){
    return handleLatestDiscussions(data, socket);
}
       
function handleClear(data, socket){
    db.deleteDiscussion({user:data.user, to:data.to}, function(){
        Lara.encodeSafeSocket({request: "cleared", identity: data.user, user: data.user}, function(out){
            return socket.emit("safeSocket", out);
        });
    });
}

function handleLatestDiscussions(data, socket){
    db.getLatestMessages({user:data.user}, function(err, res){
        if(res.length){
            Lara.encodeSafeSocket({request: "latest discussions", identity: data.user, user: data.user, message: res}, function(out){
                return socket.emit("safeSocket", out);
            });
        }        
    });
}

function onIsWriting(data, socket){
    if(users[data.to] != undefined) {
        Lara.encodeSafeSocket({request: "recipient is writing", identity: data.to, user: data.user, data: data}, function(out){
            return socket.to(users[data.to].id).emit("safeSocket", out);
        });
    }
}

function addToBlacklist(data, socket){
    db.addToBlacklist(data);
}

function deleteBlacklist(data, socket){
    db.deleteBlacklist(data);
}

function switchWhitelist(data, socket){
    db.switchWhitelist(data);
}

function checkIfWhitelistIsActivated(data, socket){
    db.checkIfWhitelistIsActivated(data, function(result){
        Lara.encodeSafeSocket({request: "is whitelist active", identity: data.user, user: data.user, answer: result}, function(out){
                return socket.emit("safeSocket", out);
            });
    });
}

function addToWhitelist(data, socket){
    db.addToWhitelist(data);
}

function deleteWhitelist(data, socket){
    db.deleteWhitelist(data);
}

function handleOutput(data, socket){
        db.getLastMessage({user:data.user, receiver:data.to}, function(err, res){
            if(users[data.to] != undefined) {
                Lara.encodeSafeSocket({request: "output", identity: data.user, user: data.user, message: res}, function(out){
                    socket.emit("safeSocket", out);
                });
                Lara.encodeSafeSocket({request: "output", identity: data.to, user: data.user, message: res}, function(out){
                    socket.to(users[data.to].id).emit("safeSocket", out);
                });                
            }
            else{
                Lara.encodeSafeSocket({request: "output", identity: data.user, user: data.user, to: data.to, message: res}, function(out){
                    return socket.emit("safeSocket", out);
                });
            }
        });
    
}
