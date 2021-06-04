
const express = require('express')
const api = express()
const port = process.env.PORT || 2000

api.get("/", (req, res) => {
    res.send({value: "Hello postman"})
})

api.listen(port, () => {
    console.log(`Autoescuela api escuchando en ${port}`)
})
