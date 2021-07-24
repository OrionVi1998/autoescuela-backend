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
        if (t.usuario_id !== null) {
            let profe = contenedorProfesor.getProfesor({id_usuario: t.usuario_id})
            t.title = `${alumno.nombre} ${alumno.apellido} con ${profe.nombre} ${profe.apellido}`
        } else {
            t.title = `${alumno.nombre} ${alumno.apellido} -> FALTA PROFESOR`
        }


    })

    res.send(turnos_retorno)
})

api.put(`/crearTurno/`, (req, res) => {
    //
    console.log(req.body) // objeto json con el turno
    let alumno_id, usuario_id, fechaHoraInicio, fechaHoraFin;
    ({alumno_id, usuario_id, fechaHoraInicio, fechaHoraFin} = req.body)

    try {

        // El " / 60000" es para convertir de milisegundos a minutos.
        let duracionClase = ((Number(Turno.convertirFechaStringADate(fechaHoraFin).getTime()) - Number(Turno.convertirFechaStringADate(fechaHoraInicio).getTime())) / 60000)

        // patron de mediador
        if (contenedorProfesor.getProfesor({id_usuario: usuario_id}).verificarDispHoraria(Turno.convertirFechaStringADate(fechaHoraInicio), duracionClase)) {

            // devolvemos la respuesta de la creacion de turno, "true" o "false"
            res.send(contenedorTurno.crearTurno(alumno_id, usuario_id, fechaHoraInicio, fechaHoraFin, 1))

        } else {

            // si no hay disponibilidad horaria del profesor, devolvemos false
            res.send(false)
        }

    } catch (e) {
        console.log(e)
    }
})

api.post(`/editarTurno/`, (req, res) => {

    try {
        res.send(contenedorTurno.editarTurno(req.body))
    } catch (e) {
        console.log(e)
    }
})

api.get(`/getAlumnos/`, (req, res) => {
    let alumnos_retorno = contenedorAlumno.getAlumnos()
    console.log(`GET ALUMNOS - ENVIANDO`)
    res.send(alumnos_retorno)
})

api.get("/getTurnosProfesor/", (req, res) => {
    console.log(`GET TURNOS PROFESOR - ${req.query.usuario_id}`)
    let turnos_retorno = contenedorTurno.getTurnosProfesor(req.query)
    res.send(turnos_retorno)
})

api.get("/getAlumnos/", (req, res) => {
    let alumnos_retorno = contenedorAlumno.getAlumnos()
    console.log(`GET ALUMNOS - ENVIANDO`)
    res.send(alumnos_retorno)
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

    //TODO: Posible eliminar?

    try {
        contenedorAlumno.eliminarAlumno({id_alumno: Number(req.query.id_alumno)})
        res.send(true)
    } catch (e) {
        console.log(e)
    }

})

api.get("/getProfesores/", (req, res) => {
    let profesores_retorno = contenedorProfesor.getProfesores()
    console.log("GET PROFESORES - ENVIANDO")
    res.send(profesores_retorno)
})

api.put("/crearProfesor", (req, res) => {
    console.log(`CREAR_PROFESOR - ${req.body}`) // objeto json con el profesor
    try {
        contenedorProfesor.crearProfesor(
            req.body.email,
            req.body.nombre,
            req.body.apellido,
            req.body.telefono,
            req.body.direccion,
            req.body.horaInicio,
            req.body.horaFin
        )

        res.send(true)
    } catch (e) {
        console.log(e)
    }

})

api.post("/editarProfesor", (req, res) => {
    console.log(`EDITAR PROFESOR - ${req.body.id_usuario}`)

    try {
        contenedorTurno.desvincularTrunosIncompatProfesor(req.body)
        contenedorProfesor.editarProfesor(req.body)
        res.send(true)
    } catch (e) {
        console.log(e)
    }

})


api.delete("/eliminarProfesor", (req, res) => {
    console.log(`ELIMINAR PROFESOR - ${req.query.id_usuario}`)

    req.query.id_usuario = Number(req.query.id_usuario)

    let profesores_eliminar = contenedorProfesor.getProfesor(req.query) // {nombres ...}
    try {
        contenedorProfesor.eliminarProfesor(profesores_eliminar)
        contenedorTurno.desvincularProfesor(profesores_eliminar)
        res.send(true)
    }catch (e) {
        console.log(e)
    }
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


api.post("/editarPaquete/", (req, res) => {

    console.log(`EDITAR PAQUETE - ${req.body.id_paquete}`)

    try {
        contenedorPaquete.editarPaquete(req.body)
        res.send(true)
    } catch (e) {
        console.log(e)
    }

})
/*
api.delete("/eliminarPaquete/", (req, res) => {

    console.log(`ELIMINAR PAQUETE - ${req.query.id_paquete}`)

    try {
        contenedorPaquete.eliminarPaquete({id_paquete: Number(req.query.id_paquete)})
        res.send(true)
    } catch (e) {
        console.log(e)
    }

})
*/
