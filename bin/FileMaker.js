const fs = require('fs');
const {DatabaseConnection} =  require("./DatabaseConnection");
const {ModelFactory} = require('./factory/ModelFactory')
const {DAOFactory} = require('./factory/DAOFactory')
const {RouteFactory} = require('./factory/RouteFactory')

class FileMaker {

    generateFolder(){
        try {
            if (!fs.existsSync('./src')) {
                fs.mkdirSync('./src');
                fs.mkdirSync('./src/model');
                fs.mkdirSync('./src/DAO');
            }
            else if(!fs.existsSync('./src/model')){
                fs.mkdirSync('./src/model')
                fs.mkdirSync('./src/DAO')
            }
            else if(!fs.existsSync('./src/DAO')){
                fs.mkdirSync('./src/DAO')
            }
        } catch (err) {
            console.error(err);
        }
    }
    async createModel(){
        this.generateFolder()
        const tableList = await new DatabaseConnection().getTableList()
        tableList.map(async tablename => {
            const tableDetails = await new DatabaseConnection().getTableDetails(tablename)
            const pathModel = './src/model/'+tablename+'.js'

            const currentClass = new ModelFactory(tablename, tableDetails).render()
            fs.writeFile(pathModel, currentClass, function (err){
                if(err) throw err;
            })
        })
    }

    async createDAO(){
        const tableList = await new DatabaseConnection().getTableList()
        tableList.map(async tablename => {
            const tableDetails = await new DatabaseConnection().getTableDetails(tablename)
            const pathDAO = './src/DAO/'+tablename+'DAO.js'
            const currentDAO = new DAOFactory(tablename, tableDetails).render()

            fs.writeFile(pathDAO,currentDAO, function (err){
                if(err) throw err;
            })
        })
    }


    async createServer(){
        const tableList = await new DatabaseConnection().getTableList()
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
        new RouteFactory(tableList).createApi()
    }
}

module.exports = {
    FileMaker
}