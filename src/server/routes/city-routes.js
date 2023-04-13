const router = require('express').Router();
const {cityDAO} = require('../../DAO/cityDAO.js')
const {city} = require('../../entity/city')
router.get('/all', function (req, res){
    res.append('Content-Type', 'application/json');
    (async ()=> {
        let cityDao = new cityDAO()
        let cityList = (await cityDao.getAllcity())
        res.send(JSON.stringify(cityList))
    })();
})

router.get('/one/:id', function (req, res){
    res.append('Content-Type', 'application/json');
    (async ()=> {
        let cityDao = new cityDAO()
        let cityList = (await cityDao.getOnecity(req.params.id))
        res.send(JSON.stringify(cityList))
    })();
})

router.post('/new', function (req, res){
    res.append('Content-Type', 'application/json');
    console.log(req.body);
    let newcity = new city();
    newcity.setname(req.body.name);
    (async ()=> {
        let cityDao = new cityDAO()
        let cityList = (await cityDao.savecity(newcity))
        res.send(JSON.stringify(cityList))
    })();
})
router.post('/delete/:id', function (req, res){
    res.append('Content-Type', 'application/json');
    (async ()=> {
        let cityDao = new cityDAO()
         let cityList = (await cityDao.removecity(req.params.id))
         res.send(JSON.stringify(cityList))
    })();
})

module.exports = router