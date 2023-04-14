const mysql = require('mysql');
const fs = require('fs');
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
            fs.mkdirSync('./src/DAO')
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

    //Constructor
    classSample += '\tconstructor('+listOfProperty.toString()+') {\n'
        for(let i=0; i<listOfProperty.length; i++){
            classSample +="\t\tthis."+listOfProperty[i]+  " = "+listOfProperty[i]+'\n'
        }
        classSample += "\t}"

    //Getter & Setter
    listOfProperty.map(property => {
        classSample+= "\n\tget"+property+"(){\n\t\treturn this."+property+"\n\t};"
        classSample+= "\n\tset"+property+"("+property+"){\n\t\tthis."+property+" = "+property+" \n\t};"
    })

    classSample+= "\n};"
    classSample+= "\nmodule.exports = {"+className+"}"

    return classSample
}

async function DAOSample(className){
    let tableDetails = await getTableDetails(className)
    let repoSample = 'const utils = require(\'';
        if(process.env.DEV == "TRUE"){
            repoSample += '../../bin/utils.js'
        } else {
            repoSample += 'simple-dao-generator/bin/utils.js'
        }

    repoSample += '\');\n' +
        'const connection = utils.getConnection();\n'
           + 'const {'+className+'} = require(\'../entity/'+className+'.js\');  '
    repoSample += "\nclass " + className + "DAO{\n"
    repoSample += "async getAll"+className+"(){\n" +
        "        let "+className+"List = [];\n" +
        "        return await new Promise((res, rej) => {\n" +
        "        connection.query('USE "+process.env.DATABASE_NAME +"')\n"+
        "            connection.query('SELECT * FROM "+className+"', function (err, rows, fields ){\n" +
        "                for(let row of rows){\n" +
        "                    let new"+className+" = new "+className+"(";
        tableDetails.map(params => {
            repoSample += `row.${params}, `
        })
    repoSample +=
        ")\n" +
        "                    "+className+"List.push(new"+className+")\n" +
        "                }\n" +
        "                res("+className+"List)\n" +
        "                return;\n" +
        "            })\n" +
        "        })\n" +
        "    }"
    repoSample += "\nasync getOne"+className+"(id){\n" +
        "        return await new Promise((res, rej)=>{\n" +
        "        connection.query('USE "+process.env.DATABASE_NAME +"')\n"+
        "            connection.query('SELECT * FROM "+className+" WHERE id=' + id, function (err, rows, fields){\n" +
        "                for (let row of rows){\n" +
        "                    let new"+className+" = new "+className+"(";
        tableDetails.map(params => {
            repoSample += `row.${params}, `
        })
    repoSample +=        ")\n" +
        "                    res(new"+className+")\n" +
        "                }\n" +
        "            })\n" +
        "        })\n" +
        "    }"

    repoSample +="\nsave"+className+"("+className+")" +
        "{\nconnection.query('USE "+process.env.DATABASE_NAME +"')\n" +
        " connection.query('INSERT INTO "+className+" (";
        tableDetails.map((params, index)=> {
            if('id' != params){
                if(index != (tableDetails.length-1)) {
                    repoSample += `${params}, `
                }
                else {
                    repoSample += `${params}`
                }
            }
        })

        repoSample +=") VALUES ('+"
        tableDetails.map((params, index) => {
            if ('id' != params) {
            if(index != (tableDetails.length-1)) {
                repoSample += `JSON.stringify(${className}.${params})+','+ `
            }
            else {
                repoSample += `JSON.stringify(${className}.${params})`
                return;
            }
            }
        })
    repoSample +=
        "+')')\n" +
        "return "+className+";\n }"

    repoSample +="\nremove"+className+"(id){\n" +
        "        connection.query('USE "+process.env.DATABASE_NAME +"')\n"+
        "        connection.query('DELETE FROM "+className+" where id='+ id)\n" +
        "        return;\n" +
        "    }"

    repoSample += "\n};"
    repoSample += "\nmodule.exports = {"+className+"DAO: "+className+"DAO}"
    return repoSample
}

async function createServer(){
    let tableList = await getTable();
    try {
        if (!fs.existsSync('./src')) {
            fs.mkdirSync('./src');
            fs.mkdirSync('./src/server');
            fs.mkdirSync('./src/server/routes');
        }
        else if(!fs.existsSync('./src/server')){
            fs.mkdirSync('./src/server')
            fs.mkdirSync('./src/server/routes');
        }
        else if(!fs.existsSync('./src/server/routes')){
            fs.mkdirSync('./src/server/routes')
        }
    } catch (err) {
        console.error(err);
    }
    let appData = "const express = require('express')\n" +
        "const app = express()\n" +
        "\n" +
        "const port = 3000\n" +
        "app.use(express.json())\n" +
        "\n";
        tableList.map(tableName => {
            appData += `app.use("/${tableName}",require("./routes/${tableName}-routes"))\n`
        })
    appData +=
        "app.listen(port, () => {\n" +
        "    console.log(`App running on 127.0.0.1:${port}`)\n" +
        "})";


    fs.writeFile('./src/server/app.js', appData, function (err){
        if(err) throw err;
    })

}
async function createRoute(){
    let tableList = await getTable();
    tableList.map(async tableName => {
        let tableDetails = await getTableDetails(tableName);
        let tableData = "const router = require('express').Router();\n" +
            `const {${tableName}DAO} = require('../../DAO/${tableName}DAO.js')\n` +
            `const {${tableName}} = require('../../entity/${tableName}')\n` +

            "router.get('/all', function (req, res){\n" +
            "    res.append('Content-Type', 'application/json');\n" +
            "    (async ()=> {\n" +
            `        let ${tableName}Dao = new ${tableName}DAO()\n` +
            `        let ${tableName}List = (await ${tableName}Dao.getAll${tableName}())\n` +
            `        res.send(JSON.stringify(${tableName}List))\n` +
            "    })();\n" +
            "})\n" +
            "\n" +

            "router.get('/one/:id', function (req, res){\n" +
            "    res.append('Content-Type', 'application/json');\n" +
            "    (async ()=> {\n" +
            `        let ${tableName}Dao = new ${tableName}DAO()\n` +
            `        let ${tableName}List = (await ${tableName}Dao.getOne${tableName}(req.params.id))\n` +
            `        res.send(JSON.stringify(${tableName}List))\n` +
            "    })();\n" +
            "})\n" +
            "\n";

            tableData += "router.post('/new', function (req, res){\n" +
            "    res.append('Content-Type', 'application/json');\n" +
            `    let new${tableName} = new ${tableName}();\n`;
                tableDetails.map(params => {
                    if(params != 'id'){
                        tableData += `    new${tableName}.set${params}(req.body.${params});\n`
                    }
                })
            tableData+=
            "    (async ()=> {\n" +
            `        let ${tableName}Dao = new ${tableName}DAO()\n` +
            `        let ${tableName}List = (await ${tableName}Dao.save${tableName}(new${tableName}))\n ` +
            `       res.send(JSON.stringify(${tableName}List))\n` +
            "    })();\n" +
            "})\n"
                tableData +=
            "router.post('/delete/:id', function (req, res){\n" +
            "    res.append('Content-Type', 'application/json');\n" +
            "    (async ()=> {\n" +
            `        let ${tableName}Dao = new ${tableName}DAO()\n ` +
            `        let ${tableName}List = (await ${tableName}Dao.remove${tableName}(req.params.id))\n ` +
            `        res.send(JSON.stringify(${tableName}List))\n` +
            "    })();\n" +
            "})\n" +
            "\n" +
            "module.exports = router"

        fs.writeFile(`./src/server/routes/${tableName}-routes.js`, tableData, function (err){
            if(err) throw err;
        })
    })

}

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
    getConnection,
    createDatabase,
    deleteDatabase,
    createEntity,
    createServer,
    createRoute,
    initPackage
}