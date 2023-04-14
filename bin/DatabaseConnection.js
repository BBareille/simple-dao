const mysql = require('mysql');
class DatabaseConnection {

    connection;
    constructor() {
       this.connection = this.getConnection()
    }
    getConnection(){
        return mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD
        })
    }

    async getDatabaseList(){
        const arrayOfDatabase = new Promise((res, rej) => {
            this.connection.query('SELECT TABLE_SCHEMA\n' +
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
        this.connection.end();
    }

    createDatabase() {
        this.connection.query("CREATE DATABASE IF NOT EXISTS "+process.env.DATABASE_NAME)
        this.connection.end();
    }

    deleteDatabase() {
        this.connection.query('DROP DATABASE IF EXISTS '+process.env.DATABASE_NAME)
        this.connection.end();
    }

    getTableList(){
        this.connection.query('USE ' + process.env.DATABASE_NAME)
        const tableList = new Promise((res, req)=> {
            this.connection.query('SHOW TABLES', function (err, rows, fields){
                res(rows.map(item => item.Tables_in_newdb))
            })
        });
        this.connection.end();
        return tableList;
    }

    async getTableDetails(tableName){
        this.connection.query('USE ' + process.env.DATABASE_NAME)
        const tableDetails = new Promise((res, req) => {
            this.connection.query('SELECT * FROM '+tableName, function (err, rows, fields){
                res(fields.map(item => item.name))
            })
        })
        this.connection.end()
        return tableDetails
    }


}

module.exports = {
    DatabaseConnection
}