const utils = require('../../bin/utils.js');
const connection = utils.getConnection();
const {persons} = require('../entity/persons.js');  
class personsDAO{
async getAllpersons(){
        let personsList = [];
        return await new Promise((res, rej) => {
        connection.query('USE newdb')
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
        connection.query('USE newdb')
            connection.query('SELECT * FROM persons WHERE id=' + id, function (err, rows, fields){
                for (let row of rows){
                    let newpersons = new persons(row.name, row.id)
                    res(newpersons)
                }
            })
        })
    }
savepersons(persons){
connection.query('USE newdb')
 connection.query('INSERT INTO persons (name) VALUES ('+ persons.name+')')
return persons;
 }
removepersons(id){
        connection.query('USE newdb')
        connection.query('DELETE FROM persons where id='+ id)
        return;
    }
};
module.exports = {personsDAO: personsDAO}