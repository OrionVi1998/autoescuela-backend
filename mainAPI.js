const express = require('express')
const api = express()
const port = process.env.PORT || 2000
const cors = require("cors")
const {Paquete, ContenedorPaquete} = require("./Modelo/Paquete")
const {Profesor, ContenedorProfesor} = require("./Modelo/Profesor")
const {Alumno, ContenedorAlumno} = require("./Modelo/Alumno")
const {Pago, ContenedorPagos} = require("./Modelo/Pago")
const {Administrador, ContenedorAdministrador} = require("./Modelo/Administrador")
const {Turno, ContenedorTurno} = require("./Modelo/Turno")
const {mediadorAsociarPaquete} = require("./Modelo/Mediadores")

let contenedorPagos;
let contenedorPaquete;
let contenedorProfesor;
let contenedorAlumno;
let contenedorAdministrador;
let contenedorTurno;

async function init() {
    // Inicializo el modelo
    contenedorPaquete = await ContenedorPaquete.build()
    contenedorAdministrador = await ContenedorAdministrador.build()
    contenedorAlumno = await ContenedorAlumno.build()
    contenedorProfesor = await ContenedorProfesor.build()
    contenedorPagos = await ContenedorPagos.build()
    contenedorTurno = await ContenedorTurno.build()
}

init().then(() => {
    console.log("INIT RUN")
    api.listen(port, () => {
        //Abro la api
        console.log(`Autoescuela api escuchando en ${port}`)
    })

}).catch(err => {
    console.log(err)
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

api.get("/getPagos/", (req, res) => {
    let pagos_retorno = contenedorPagos.getPagos()
    console.log("GET ALUMNOS - ENVIANDO")
    res.send(pagos_retorno)

})

api.get("/getTurnos/", (req, res) => {

    let turnos_retorno = contenedorTurno.getTurnos()
    console.log("GET TURNOS - ENVIANDO")
    res.send(turnos_retorno)

})

api.get("/getAlumnos/", (req, res) => {
    let alumnos_retorno = contenedorAlumno.getAlumnos()
    console.log("GET ALUMNOS - ENVIANDO")
    res.send(alumnos_retorno)
})

api.get("/getProfesores/", (req, res) => {
    let profesores_retorno = contenedorProfesor.getProfesores()
    console.log("GET PROFESORES - ENVIANDO")
    res.send(profesores_retorno)
})

api.get("/getAdministradores/", (req, res) => {
    let administradores_retorno = contenedorAdministrador.getAdministradores()
    console.log("GET ADMINISTRADORES")
    res.send(administradores_retorno)
})

api.post("/crearAlumno/", (req, res) => {
    //TODO
    console.log(req)

})
