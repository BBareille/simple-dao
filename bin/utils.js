const fs = require('fs');
const {ModelFactory} = require("./factory/ModelFactory");
const {DAOFactory} = require("./factory/DAOFactory");
const {DatabaseConnection} = require("./DatabaseConnection");
const {RouteFactory} = require("./factory/RouteFactory");
require('dotenv').config();

function initPackage(){
    let data = "DATABASE_URL=\"mysql://root:@127.0.0.1:3306/newDB\"\n" +
        "DATABASE_USER=\"root\"\n" +
        "DATABASE_PASSWORD=\"\"\n" +
        "DATABASE_HOST=\"127.0.0.1\"\n" +
        "DATABASE_PORT=\"3306\"\n" +
        "DATABASE_NAME=\"newdb\""
    fs.writeFile('./.env', data, function (err){
        if(err) throw err;
    })
}

module.exports = {
    initPackage
}