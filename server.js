const app = require('express')();
const express = require('express');
const path = require('path');
const serverlib = require('./serverlib.js')
const ejs = require('ejs');
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT);
serverlib.listen(server);

app.use(express.static(path.join(__dirname, './assets')));
app.set('view engine', 'ejs');
app.get("/", function(req, res) {
    res.render("../index.ejs")
});
