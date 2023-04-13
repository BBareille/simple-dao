const utils = require('../../bin/utils.js');
const connection = utils.getConnection();
const {user} = require('../entity/user.js');  
class userDAO{
async getAlluser(){
        let userList = [];
        return await new Promise((res, rej) => {
        connection.query('USE newdb')
            connection.query('SELECT * FROM user', function (err, rows, fields ){
                for(let row of rows){
                    let newuser = new user(row.name, row.id)
                    userList.push(newuser)
                }
                res(userList)
                return;
            })
        })
    }
async getOneuser(id){
        return await new Promise((res, rej)=>{
        connection.query('USE newdb')
            connection.query('SELECT * FROM user WHERE id=' + id, function (err, rows, fields){
                for (let row of rows){
                    let newuser = new user(row.name, row.id)
                    res(newuser)
                }
            })
        })
    }
saveuser(user){
connection.query('USE newdb')
 connection.query('INSERT INTO user (name) VALUES (JSON.stringify(user.name))')
return user;
 }
removeuser(id){
        connection.query('USE newdb')
        connection.query('DELETE FROM user where id='+ id)
        return;
    }
};
module.exports = {userDAO: userDAO}