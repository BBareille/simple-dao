const {DatabaseConnection} = require("../DatabaseConnection");
class DAOFactory {

    name = "";
    columns= [];

    constructor(name, columns) {
        this.name = name;
        this.columns = columns;
    }

    render(){
        let repoSample = 'const utils = require(\'';
        if(process.env.DEV == "TRUE"){
            repoSample += '../../bin/utils.js'
        } else {
            repoSample += 'simple-dao-generator/bin/utils.js'
        }

        repoSample += '\');\n' +
            'const connection = utils.getConnection();\n'
            + 'const {'+this.name+'} = require(\'../model/'+this.name+'.js\');  '
        repoSample += "\nclass " + this.name + "DAO{\n"
        repoSample += "async getAll"+this.name+"(){\n" +
            "        let "+this.name+"List = [];\n" +
            "        return await new Promise((res, rej) => {\n" +
            "        connection.query('USE "+process.env.DATABASE_NAME +"')\n"+
            "            connection.query('SELECT * FROM "+this.name+"', function (err, rows, fields ){\n" +
            "                for(let row of rows){\n" +
            "                    let new"+this.name+" = new "+this.name+"(";
        this.columns.map(async params => {
            repoSample += `row.${await params}, `
        })
        repoSample +=
            ")\n" +
            "                    "+this.name+"List.push(new"+this.name+")\n" +
            "                }\n" +
            "                res("+this.name+"List)\n" +
            "                return;\n" +
            "            })\n" +
            "        })\n" +
            "    }"
        repoSample += "\nasync getOne"+this.name+"(id){\n" +
            "        return await new Promise((res, rej)=>{\n" +
            "        connection.query('USE "+process.env.DATABASE_NAME +"')\n"+
            "            connection.query('SELECT * FROM "+this.name+" WHERE id=' + id, function (err, rows, fields){\n" +
            "                for (let row of rows){\n" +
            "                    let new"+this.name+" = new "+this.name+"(";
        this.columns.map(params => {
            repoSample += `row.${params}, `
        })
        repoSample +=        ")\n" +
            "                    res(new"+this.name+")\n" +
            "                }\n" +
            "            })\n" +
            "        })\n" +
            "    }"

        repoSample +="\nsave"+this.name+"("+this.name+")" +
            "{\nconnection.query('USE "+process.env.DATABASE_NAME +"')\n" +
            " connection.query('INSERT INTO "+this.name+" (";
        this.columns.map((params, index)=> {
            if('id' != params){
                if(index != (this.columns.length-1)) {
                    repoSample += `${params}, `
                }
                else {
                    repoSample += `${params}`
                }
            }
        })

        repoSample +=") VALUES ('+"
        this.columns.map((params, index) => {
            if ('id' != params) {
                if(index != (this.columns.length-1)) {
                    repoSample += `JSON.stringify(${this.name}.${params})+','+ `
                }
                else {
                    repoSample += `JSON.stringify(${this.name}.${params})`
                    return;
                }
            }
        })
        repoSample +=
            "+')')\n" +
            "return "+this.name+";\n }"

        repoSample +="\nremove"+this.name+"(id){\n" +
            "        connection.query('USE "+process.env.DATABASE_NAME +"')\n"+
            "        connection.query('DELETE FROM "+this.name+" where id='+ id)\n" +
            "        return;\n" +
            "    }"

        repoSample += "\n};"
        repoSample += "\nmodule.exports = {"+this.name+"DAO: "+this.name+"DAO}"
        return repoSample
    }
}

module.exports = {
    DAOFactory
}