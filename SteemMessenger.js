const app = require('express')();
const express = require('express');
const path = require('path');
const serverLib = require('./server/serverlib.js');
//const apiServerLib = require('./apiServerLib.js')
const STMServer = require('./server/programs/STMServer.js');
const ejs = require('ejs');
const PORT = process.env.PORT || 4000;
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
