#! /usr/bin/env node
const yargs = require("yargs");
const utils = require('./utils.js')
// const {CityDao} = require("../src/DAO/cityDAO");
// const {city} = require("../src/entity/city");

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
// if(yargs.argv.getAllCity == true){
//     (async () => {
//         let dao = new CityDao()
//         console.log(await dao.getAllCity())
//     })()
//     return;
// }
// if(yargs.argv.getOne == true){
//     (async () => {
//         let dao = new CityDao()
//         console.log(await dao.getOneCity(3))
//     })()
//     return;
// }
// if(yargs.argv.save == true){
//     (async () => {
//         let dao = new CityDao()
//         let newCity = new city()
//         newCity.setname('Austerlitz')
//         dao.saveCity(newCity)
//     })()
//     return;
// }




if(yargs.argv._[0] == null){
    utils.showHelp();
    return;
}