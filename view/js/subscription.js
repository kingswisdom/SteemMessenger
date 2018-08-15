const login = require('./login.js')

exports.checkSubscription = function(data, out){
    login.checkSubscription(data, function(result){
        if(result.check == true){

        }
        if(result.check == false){
            
        }
    })
}