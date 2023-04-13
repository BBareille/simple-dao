#! /usr/bin/env node
const yargs = require("yargs");
const utils = require('./utils.js')

const usage = "\nUsage: dao-test <schema_name> schema to analyze";
const options = yargs
    .usage(usage)
    .option("databaseList", {alias : "dl", describe: "List all database", demandOption: false})
    .option("createDatabase", {alias : "cd", describe: "Create database", demandOption: false})
    .option("dropDatabase", {alias : "dd", describe: "Delete database", demandOption: false})
    .option('test')
    .help(true)
    .argv;



if(yargs.argv.dl == true || yargs.argv.databaseList == true){
    utils.getDatabaseList();
    return;
}

if(yargs.argv.cd == true || yargs.argv.createDatabase == true){
    utils.createDatabase();
    return;
}
if(yargs.argv.dd == true || yargs.argv.dropDatabase == true){
    utils.deleteDatabase();
    return;
}
if(yargs.argv.gt == true || yargs.argv.getTable == true){
    utils.getTable();
    return;
}
if(yargs.argv.gtd == true || yargs.argv.getTableDetails == true){
    utils.getTableDetails();
    return;
}
if(yargs.argv.ce == true || yargs.argv.createEntity == true){
    utils.createEntity();
    return;
}
if(yargs.argv.createServer == true) {
    utils.createServer();
    return;
}
if(yargs.argv.createRoute == true) {
    utils.createRoute();
    return;
}





if(yargs.argv._[0] == null){
    utils.showHelp();
    return;
}