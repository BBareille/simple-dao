#! /usr/bin/env node
const yargs = require("yargs");
const utils = require('./utils.js')

const usage = "\nUsage: dao-test <schema_name> schema to analyze";
const options = yargs
    .usage(usage)
    .option("databaseList", {alias : "dl", describe: "List all database", demandOption: false})
    .option("createDatabase", {alias : "cd", describe: "Create database", demandOption: false})
    .option("dropDatabase", {alias : "dd", describe: "Delete database", demandOption: false})
    .option("createDAO", {alias : "CDAO", describe: "Create DAO & model from database", demandOption: false})
    .option("createServer", {alias : "CS", describe: "Create express server w/ route", demandOption: false})
    .help(true)
    .argv;

if(yargs.argv.cd == true || yargs.argv.createDatabase == true){
    utils.createDatabase();
    return;
}
if(yargs.argv.dd == true || yargs.argv.dropDatabase == true){
    utils.deleteDatabase();
    return;
}
if(yargs.argv.CDAO == true || yargs.argv.createDAO == true){
    utils.createEntity();
    return;
}
if(yargs.argv.createServer == true) {
    utils.createServer();
    utils.createRoute();
    console.log('Use : \n\tnpm run startServ\n\nThanks to use my lib !')
    return;
}





if(yargs.argv._[0] == null){
    utils.showHelp();
    return;
}