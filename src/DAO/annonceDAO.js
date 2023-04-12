const utils = require('../../bin/utils.js')
const connection = utils.getConnection()
class annonceDAO{
async getAllannonce(){
        let annonceList = [];
        return await new Promise((res, rej) => {
            connection.query('SELECT * FROM annonce', function (err, rows, fields ){
                for(let row of rows){
                    let newannonce = new annonce(row.name, row.id)
                    annonceList.push(newannonce)
                }
                res(annonceList)
                return;
            })
        })
    }
async getOneannonce(id){
        return await new Promise((res, rej)=>{
            connection.query('SELECT * FROM annonce WHERE id=' + id, function (err, rows, fields){
                for (let row of rows){
                    let newannonce = new annonce(row.name, row.id)
                    res(newannonce)
                }
            })
        })
    }
};
module.exports = {annonceDAO: annonceDAO}