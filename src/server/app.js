const http = require('http');
const {cityDAO} = require('../DAO/cityDAO.js')
const {city} = require('../Entity/city.js')

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    (async ()=> {
        let cityDao = new cityDAO()
        let cityList = (await cityDao.getAllcity())
        res.end(JSON.stringify(cityList))
    })();
});


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});