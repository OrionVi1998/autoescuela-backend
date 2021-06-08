const express = require('express')
const api = express()
const port = process.env.PORT || 2000
const cors = require("cors")
const {Paquete, ContenedorPaquete} = require("./Modelo/Paquete")


let contenedorPaquete = null
ContenedorPaquete.build().then(cp => {
    console.log("init paquetes")
    contenedorPaquete = cp
})

api.use(cors({origin: "http://localhost:3000"}))


api.get("/", (req, res) => {
    res.send({value: "Hello postman"})
})

api.get("/getPaquetes/", (req, res) => {
    let paquetes_retorno = contenedorPaquete.getPaquetesVisibles()
    console.log("GET PAQUETES - ENVIANDO")
    res.send(paquetes_retorno)
})

/*
api.post("/asociarPaquete/") {
    let (paq, alum) =
}
*/


api.post("/crearAlumno/", (req, res) => {

    res.send(
        true
    )
})


api.listen(port, () => {
    console.log(`Autoescuela api escuchando en ${port}`)
})
