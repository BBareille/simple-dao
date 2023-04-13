const express = require('express')
const app = express()

const port = 3000
app.use(express.json())

app.use("/city",require("./routes/city-routes"))
app.use("/persons",require("./routes/persons-routes"))
app.use("/user",require("./routes/user-routes"))
app.listen(port, () => {
    console.log(`App running on 127.0.0.1:${port}`)
})