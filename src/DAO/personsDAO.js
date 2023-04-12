const utils = require('../../bin/utils.js')
const connection = utils.getConnection()
class personsDAO{
async getAllpersons(){
        let personsList = [];
        return await new Promise((res, rej) => {
            connection.query('SELECT * FROM persons', function (err, rows, fields ){
                for(let row of rows){
                    let newpersons = new persons(row.name, row.id)
                    personsList.push(newpersons)
                }
                res(personsList)
                return;
            })
        })
    }
async getOnepersons(id){
        return await new Promise((res, rej)=>{
            connection.query('SELECT * FROM persons WHERE id=' + id, function (err, rows, fields){
                for (let row of rows){
                    let newpersons = new persons(row.name, row.id)
                    res(newpersons)
                }
            })
        })
    }
};
module.exports = {personsDAO: personsDAO}