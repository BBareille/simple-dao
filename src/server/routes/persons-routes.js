const router = require('express').Router();
const {personsDAO} = require('../../DAO/personsDAO.js')
const {persons} = require('../../entity/persons')
router.get('/all', function (req, res){
    res.append('Content-Type', 'application/json');
    (async ()=> {
        let personsDao = new personsDAO()
        let personsList = (await personsDao.getAllpersons())
        res.send(JSON.stringify(personsList))
    })();
})

router.get('/one/:id', function (req, res){
    res.append('Content-Type', 'application/json');
    (async ()=> {
        let personsDao = new personsDAO()
        let personsList = (await personsDao.getOnepersons(req.params.id))
        res.send(JSON.stringify(personsList))
    })();
})

router.post('/new', function (req, res){
    res.append('Content-Type', 'application/json');
    console.log(req.body);
    let newpersons = new persons();
    newpersons.setname(req.body.name);
    (async ()=> {
        let personsDao = new personsDAO()
        let personsList = (await personsDao.savepersons(newpersons))
        res.send(JSON.stringify(personsList))
    })();
})
router.post('/delete/:id', function (req, res){
    res.append('Content-Type', 'application/json');
    (async ()=> {
        let personsDao = new personsDAO()
         let personsList = (await cityDao.removepersons(req.params.id))
         res.send(JSON.stringify(personsList))
    })();
})

module.exports = router