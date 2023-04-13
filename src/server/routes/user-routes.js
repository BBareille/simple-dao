const router = require('express').Router();
const {userDAO} = require('../../DAO/userDAO.js')
const {user} = require('../../entity/user')
router.get('/all', function (req, res){
    res.append('Content-Type', 'application/json');
    (async ()=> {
        let userDao = new userDAO()
        let userList = (await userDao.getAlluser())
        res.send(JSON.stringify(userList))
    })();
})

router.get('/one/:id', function (req, res){
    res.append('Content-Type', 'application/json');
    (async ()=> {
        let userDao = new userDAO()
        let userList = (await userDao.getOneuser(req.params.id))
        res.send(JSON.stringify(userList))
    })();
})

router.post('/new', function (req, res){
    res.append('Content-Type', 'application/json');
    console.log(req.body);
    let newuser = new user();
    newuser.setname(req.body.name);
    (async ()=> {
        let userDao = new userDAO()
        let userList = (await userDao.saveuser(newuser))
        res.send(JSON.stringify(userList))
    })();
})
router.post('/delete/:id', function (req, res){
    res.append('Content-Type', 'application/json');
    (async ()=> {
        let userDao = new userDAO()
         let userList = (await cityDao.removeuser(req.params.id))
         res.send(JSON.stringify(userList))
    })();
})

module.exports = router