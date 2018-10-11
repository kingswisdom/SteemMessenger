const app 		= require('express')();
const express 		= require('express');
const path 		= require('path');
const serverLib 	= require('./server/serverlib.js');
const STMServer 	= require('./server/programs/STMServer.js');
const ejs 		= require('ejs');
const PORT 		= process.env.PORT || 4000;
//const apiServerLib 	= require('./apiServerLib.js')
//const apiPORT = 3000;



const server = app.listen(PORT);
serverLib.listen(server);

/*const apiServer = app.listen(apiPORT);
apiServerLib.listen(server);*/ //TODO : Create apiServerLib.js


STMServer.start();

app.use(express.static(path.join(__dirname, './view')));
app.set('view engine', 'ejs');
app.get("/", function(req, res) {
    res.render("../view/pages/index.ejs")
});

app.get("/login",function(req, res){
	res.render("../view/pages/login.ejs")
});

app.get("/infos/what-is-steem-messenger",function(req, res){
	res.render("../view/pages/learn_more.ejs")
});

app.get("/infos/what-is-steem",function(req, res){
	res.render("../view/pages/page2.ejs")
});

app.get("/infos/privacy",function(req, res){
	res.render("../view/pages/page3.ejs")
});

app.get("/infos/our-values",function(req, res){
	res.render("../view/pages/page4.ejs")
});
