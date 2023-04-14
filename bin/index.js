#! /usr/bin/env node
const yargs = require("yargs");
const utils = require('./utils.js')

const usage = "\nUsage: DAOGEN <option> ";
const options = yargs
    .usage(usage)
    .option("init", {alias:'i', describe: "Prepare utilisation of the package", demandOption: false})
    .option("createDatabase", {alias : "cd", describe: "Create database", demandOption: false})
    .option("dropDatabase", {alias : "dd", describe: "Delete database", demandOption: false})
    .option("createDAO", {alias : "CDAO", describe: "Create DAO & model from database", demandOption: false})
    .option("createServer", {alias : "CS", describe: "Create express server w/ route", demandOption: false})
    .help(true)
    .argv;

if(yargs.argv.cd == true || yargs.argv.createDatabase == true ){
    utils.createDatabase();
    return;
}
if(yargs.argv.dd == true || yargs.argv.dropDatabase == true){
    utils.deleteDatabase();
    return;
}
if(yargs.argv.CDAO == true || yargs.argv.createDAO == true || yargs.argv[2] == "create:DAO"){
    utils.createEntity();
    return;
}
if(yargs.argv.createServer == true || yargs.argv[2] == "create:serv") {
    utils.createServer();
    utils.createRoute();
    console.log('Use : \n\tnodemon ./src/server/app.js\n\nThanks to use my lib !')
    return;
}
if(yargs.argv.init == true ||yargs.argv[2] == "init"){
    utils.initPackage();
    return;
}
if(yargs.argv[2] == null){
    yargs.showHelp()
    return;
}