const utils = require('../../bin/utils.js');
const connection = utils.getConnection();
const {city} = require('../entity/city.js');  
class cityDAO{
async getAllcity(){
        let cityList = [];
        return await new Promise((res, rej) => {
            connection.query('Use '+ process.env.DATABASE_NAME)
            connection.query('SELECT * FROM city', function (err, rows, fields ){
                for(let row of rows){
                    let newcity = new city(row.id, row.name)
                    cityList.push(newcity)
                }
                res(cityList)
                return;
            })
        })
    }
async getOnecity(id){
        return await new Promise((res, rej)=>{
            connection.query('SELECT * FROM city WHERE id=' + id, function (err, rows, fields){
                for (let row of rows){
                    let newcity = new city(row.name, row.id)
                    res(newcity)
                }
            })
        })
    }
savecity(city){
 connection.query('INSERT INTO city (name) VALUES ('+ city.name+')')
return city;
 }
removecity(id){
        connection.query('DELETE FROM city where id='+ id)
        return;
    }
};
module.exports = {cityDAO: cityDAO}