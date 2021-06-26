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
const {mediadorAsociarPaquete, mediadorPagosPaqueteAlumnos} = require("./Modelo/Mediadores")

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


api.use(cors({
    "origin": process.env.CORS_ORIGIN,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}))
api.use(express.json())

api.get(`/login`, (req, res) => {
    let admin = contenedorAdministrador.getAdministradores()
    let profesor = contenedorProfesor.getProfesores()

    admin = admin.find(a => a.email === req.query.email)
    profesor = profesor.find(p => p.email === req.query.email)

    console.log(`LOGIN ATTEMPT: ${req.query.email} - A: ${admin} - P: ${profesor} `)

    if (admin) {res.send({session: true, credencial:admin.credencial})}
    else if (profesor) {res.send({session: true, credencial:profesor.credencial})}
    else {res.send({session:false})}

})

api.get(`/`, (req, res) => {
    res.send({value: `Hello postman`})
})

api.get(`/getPaquetes/`, (req, res) => {
    let paquetes_retorno = contenedorPaquete.getPaquetesVisibles()
    console.log(`GET PAQUETES - ENVIANDO`)
    res.send(paquetes_retorno)
})

api.get(`/getPagos/`, (req, res) => {
    let pagos_retorno = contenedorPagos.getPagos()
    console.log(`GET PAGOS - ENVIANDO`)
    res.send(pagos_retorno)
})

api.get(`/getPagosAlumno`, ((req, res) => {
    let pagos_alumno_ret = mediadorPagosPaqueteAlumnos(contenedorPagos, contenedorPaquete, Number(req.query.id_alumno))
    console.log(`GET PAGOS ALUMNO ${req.query.id_alumno} - ENVIANDO`)
    res.send(pagos_alumno_ret)
}))

api.put(`/registrarPago`, ((req, res) => {

    try {
        let pago = contenedorPagos.getPago(req.body.params)
        pago.registrarPago()
        res.send(req.body.params)
    } catch (e) {
        console.log(e)
    }

}))

api.get(`/getTurnos/`, (req, res) => {
    let turnos_retorno = contenedorTurno.getTurnos()
    console.log(`GET TURNOS - ENVIANDO`)

    turnos_retorno.map((t) => {

        let alumno = contenedorAlumno.getAlumno({id_alumno: t.alumno_id})
        let profe = contenedorProfesor.getProfesor({id_usuario: t.usuario_id})

        t.title = `${alumno.nombre} ${alumno.apellido} con ${profe.nombre} ${profe.apellido}`

    })

    res.send(turnos_retorno)
})

api.get(`/getAlumnos/`, (req, res) => {
    let alumnos_retorno = contenedorAlumno.getAlumnos()
    console.log(`GET ALUMNOS - ENVIANDO`)
    res.send(alumnos_retorno)
})

api.get(`/getProfesores/`, (req, res) => {
    let profesores_retorno = contenedorProfesor.getProfesores()
    console.log(`GET PROFESORES - ENVIANDO`)
    res.send(profesores_retorno)
})

api.get(`/getAdministradores/`, (req, res) => {
    let administradores_retorno = contenedorAdministrador.getAdministradores()
    console.log(`GET ADMINISTRADORES`)
    res.send(administradores_retorno)
})

api.put(`/crearAlumno/`, (req, res) => {
    //
    console.log(req.body) // objeto json con el alumno
    let nombre, apellido, telefono, direccion;
    ({nombre, apellido, telefono, direccion} = req.body)

    try {
        contenedorAlumno.crearAlumno(nombre, apellido, Number(telefono), direccion)
        res.send(true)
    } catch (e) {
        console.log(e)
    }

})

api.post("/editarAlumno/", (req, res) => {

    console.log(`EDITAR ALUMNO - ${req.body.id_alumno}`)

    try {
        contenedorAlumno.editarAlumno(req.body)
        res.send(true)
    } catch (e) {
        console.log(e)
    }

})

api.delete("/eliminarAlumno/", (req, res) => {

    console.log(`ELIMINAR ALUMNO - ${req.query.id_alumno}`)

    try {
        contenedorAlumno.eliminarAlumno({id_alumno: Number(req.query.id_alumno)})
        res.send(true)
    } catch (e) {
        console.log(e)
    }

})



api.delete(`/eliminarProfesor`, (req, res) => {
    let profesores_eliminar = req.body // {nombres ...}
    // contenedorProfesor.eliminarProfesor(profesores_eliminar)
    // contenedorTurno.desvincularProfesor(profesores_eliminar)
})

api.put("/crearPaquete/", (req, res) => {
    console.log(req.body)
    let nombre, cantClases, durClases, precio;
    ({nombre, cantClases, durClases, precio} = req.body)

    try {
        contenedorPaquete.crearPaquete(nombre, Number(cantClases), Number(durClases), Number(precio))
        res.send(true)
    } catch (e) {
        console.log(e)
    }

})
