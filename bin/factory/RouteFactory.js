const fs = require('fs');
const {DatabaseConnection} = require("../DatabaseConnection");
class RouteFactory{

    tableList
    constructor(tableList) {
        this.tableList = tableList
    }

     createApi(){
        this.tableList.map(async(tableName)=> {
        let routeDataHeader=
            `const router = require('express').Router();\nconst {${tableName}DAO} = require('../../DAO/${tableName}DAO.js')\nconst {${tableName}} = require('../../model/${tableName}')\n\n`

        let routeDataBody = this.getOneRoute(tableName)+this.getAllRoute(tableName)+await this.postNewRoute(tableName)+this.deleteRoute(tableName)+this.updateRoute(tableName)

        let routeDataFooter = "module.exports = router"

        const routeData = routeDataHeader + routeDataBody + routeDataFooter

            fs.writeFile(`./src/server/routes/${tableName}-routes.js`, routeData, function (err){
                if(err) throw err;
            })
        })



    }

    getOneRoute(tableName){
        return "router.get('/:id', function (req, res){\n" +
            "    res.append('Content-Type', 'application/json');\n" +
            "    (async ()=> {\n" +
            `        let ${tableName}Dao = new ${tableName}DAO()\n` +
            `        let ${tableName}List = (await ${tableName}Dao.getOne${tableName}(req.params.id))\n` +
            `        res.send(JSON.stringify(${tableName}List))\n` +
            "    })();\n" +
            "})\n" +
            "\n";
    }

    getAllRoute(tableName){
        return "router.get('/', function (req, res){\n" +
            "    res.append('Content-Type', 'application/json');\n" +
            "    (async ()=> {\n" +
            `        let ${tableName}Dao = new ${tableName}DAO()\n` +
            `        let ${tableName}List = (await ${tableName}Dao.getAll${tableName}())\n` +
            `        res.send(JSON.stringify(${tableName}List))\n` +
            "    })();\n" +
            "})\n" +
            "\n"
    }

    async postNewRoute(tableName){
        let connection = new DatabaseConnection()
        let tableDetails = await connection.getTableDetails(tableName)
        let route = "router.post('/', function (req, res){\n" +
        "    res.append('Content-Type', 'application/json');\n" +
        `    let new${tableName} = new ${tableName}();\n`;

        tableDetails.map(params => {
            if(params != 'id'){
                route += `    new${tableName}.set${params}(req.body.${params});\n`
            }
        })
        route += "    (async ()=> {\n" +
            `        let ${tableName}Dao = new ${tableName}DAO()\n` +
            `        let ${tableName}List = (await ${tableName}Dao.save${tableName}(new${tableName}))\n ` +
            `       res.send(JSON.stringify(${tableName}List))\n` +
            "    })();\n" +
            "})\n"

        return route
    }

    deleteRoute(tableName){
        return "router.delete('/:id', function (req, res){\n" +
        "    res.append('Content-Type', 'application/json');\n" +
        "    (async ()=> {\n" +
        `        let ${tableName}Dao = new ${tableName}DAO()\n ` +
        `        let ${tableName}List = (await ${tableName}Dao.remove${tableName}(req.params.id))\n ` +
        `        res.send(JSON.stringify(${tableName}List))\n` +
        "    })();\n" +
        "})\n" +
        "\n";
    }

    updateRoute(tableName){
        return ''
    }
}

module.exports = {RouteFactory}