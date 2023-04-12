const yargs = require("yargs");
const mysql = require('mysql');
const fs = require('fs');
// const {city} = require("../src/entity/city");
require('dotenv').config();

const getConnection = () => {
    return mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD
    })
}
async function getDatabaseList(){
    const connection = getConnection();
    const arrayOfDatabase = new Promise((res, rej) => {
        connection.query('SELECT TABLE_SCHEMA\n' +
            'FROM information_schema.tables\n' +
            'WHERE table_type=\'BASE TABLE\'\n', function (err, rows, fields){
            if (err) throw err;
            let dbList = rows.map(item => item.TABLE_SCHEMA)
            dbList = dbList.filter((item, index) => dbList.indexOf(item) === index)
            res(dbList)
        })
    })
    console.log("List of database available :")
    for (let database of await arrayOfDatabase){
        console.log("\t\t"+database)
    }
    connection.end();
    return;
}
async function createDatabase() {
    const connection = getConnection();
    connection.query("CREATE DATABASE IF NOT EXISTS "+process.env.DATABASE_NAME)
    connection.end();
    return;
}
async function deleteDatabase() {
    const connection = getConnection();
    connection.query('DROP DATABASE IF EXISTS '+process.env.DATABASE_NAME)
    connection.end();
    return;
}
function getTable(){
    const connection = getConnection();
    connection.query('USE ' + process.env.DATABASE_NAME)
    const tableList = new Promise((res, req)=> {
        connection.query('SHOW TABLES', function (err, rows, fields){
            res(rows.map(item => item.Tables_in_newdb))
        })
    });
    connection.end();
    return tableList;
}

function getTableDetails(tableName){
    const connection = getConnection();
    connection.query('USE ' + process.env.DATABASE_NAME)
    const tableDetails = new Promise((res, req) => {
        connection.query('SELECT * FROM '+tableName, function (err, rows, fields){
            res(fields.map(item => item.name))
        })
    })
    connection.end()
    return tableDetails
}

async function createEntity(){
    try {
        if (!fs.existsSync('./src')) {
            fs.mkdirSync('./src');
            fs.mkdirSync('./src/entity');
            fs.mkdirSync('./src/DAO');
        }
        else if(!fs.existsSync('./src/entity')){
            fs.mkdirSync('./src/entity')
        }
        else if(!fs.existsSync('./src/DAO')){
            fs.mkdirSync('./src/DAO')
        }
    } catch (err) {
        console.error(err);
    }
    const tableList = await getTable()
    tableList.map(async tablename => {
        const pathEntity = './src/entity/'+tablename+'.js'
        const pathRepo = './src/DAO/'+tablename+'DAO.js'
        const currentClass = await classSample(tablename)
        const currentDAO = await DAOSample(tablename)
        fs.writeFile(pathEntity, currentClass, function (err){
            if(err) throw err;
        })
        fs.writeFile(pathRepo,currentDAO, function (err){
            if(err) throw err;
        })
    })
}

async function classSample(className){

    let listOfProperty = await getTableDetails(className)
    let classSample = "class "+ className + "{\n"
    //Property
    listOfProperty.map(property => classSample+= property+"\n")
    //Getter & Setter
    listOfProperty.map(property => {
        classSample+= "\n\tget"+property+"(){\n\t\treturn this."+property+"\n\t};"
        classSample+= "\n\tset"+property+"("+property+"){\n\t\t"+property+" = this."+property+"\n\t};"
    })

    classSample+= "\n};"

    return classSample
}

async function DAOSample(className){
    let repoSample = 'const utils = require(\'../../bin/utils.js\')\n' +
        'const connection = utils.getConnection()'
    repoSample += "\nclass " + className + "DAO{\n"
    repoSample += "async getAll"+className+"(){\n" +
        "        let "+className+"List = [];\n" +
        "        return await new Promise((res, rej) => {\n" +
        "            connection.query('SELECT * FROM "+className+"', function (err, rows, fields ){\n" +
        "                for(let row of rows){\n" +
        "                    let new"+className+" = new "+className+"(row.name, row.id)\n" +
        "                    "+className+"List.push(new"+className+")\n" +
        "                }\n" +
        "                res("+className+"List)\n" +
        "                return;\n" +
        "            })\n" +
        "        })\n" +
        "    }"
    repoSample += "\nasync getOne"+className+"(id){\n" +
        "        return await new Promise((res, rej)=>{\n" +
        "            connection.query('SELECT * FROM "+className+" WHERE id=' + id, function (err, rows, fields){\n" +
        "                for (let row of rows){\n" +
        "                    let new"+className+" = new "+className+"(row.name, row.id)\n" +
        "                    res(new"+className+")\n" +
        "                }\n" +
        "            })\n" +
        "        })\n" +
        "    }"

    //
    // saveCity(City){
    //     connection.query('INSERT INTO city (name) VALUES (\''+ City.name+'\')')
    //     return City;
    // }
    //
    // removeCity(id){
    //     connection.query('DELETE FROM City where id='+ id)
    //     return;
    // }
    repoSample += "\n};"
    repoSample += "\nmodule.exports = {"+className+"DAO: "+className+"DAO}"
    return repoSample
}



module.exports = {
    getConnection: getConnection,
    createDatabase: createDatabase,
    deleteDatabase: deleteDatabase,
    getDatabaseList: getDatabaseList,
    getTable: getTable,
    getTableDetails: getTableDetails,
    createEntity: createEntity,
}