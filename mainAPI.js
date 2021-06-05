const express = require('express')
const api = express()
const port = process.env.PORT || 2000
const Storebroker = require("./Modelo/storebroker")


api.get("/", (req, res) => {
    res.send({value: "Hello postman"})
})

api.get("/getAlumno/", (req, res) => {
    let al = new Alumno(
        1,
        "Amanda",
        "Latorre",
        45889761,
        "San Martín 2041",
        24,
        19
    )

    Storebroker.guardar_objeto(

    )
    al = JSON.parse(al)
    res.send([al])
})

api.listen(port, () => {
    console.log(`Autoescuela api escuchando en ${port}`)
})
