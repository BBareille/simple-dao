const utils = require('../../bin/utils.js')
const connection = utils.getConnection()
class cityDAO{
async getAllcity(){
        let cityList = [];
        return await new Promise((res, rej) => {
            connection.query('SELECT * FROM city', function (err, rows, fields ){
                for(let row of rows){
                    let newcity = new city(row.name, row.id)
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
};
module.exports = {cityDAO: cityDAO}