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
    try {
        let paquetes_retorno = contenedorPaquete.getPaquetesVisibles()
        console.log(`GET PAQUETES - ENVIANDO`)
        res.send(paquetes_retorno)
    } catch (e) {
        console.log(e)
    }
})


api.post(`/asociarPaquete/`, (req, res) => {

    try {
        let alumno, paqueteAsociar;
        ({alumno, paqueteAsociar} = req.body)
        console.log(`ASOCIAR_PAQUETE ${alumno.id_alumno} ${paqueteAsociar.id_paquete}`)

        // console.log(alumno)
        // console.log(paqueteAsociar)

        alumno = contenedorAlumno.getAlumno(alumno)
        paqueteAsociar = contenedorPaquete.getPaquete(paqueteAsociar.id_paquete)

        contenedorPagos.generarPagos(paqueteAsociar, alumno)

        let clasesAgregar = paqueteAsociar.cantClases

        while (clasesAgregar !== 0) {
            clasesAgregar-=1
            alumno.devolverClase(paqueteAsociar.durClases)
        }

        let pagos_alumno_ret = mediadorPagosPaqueteAlumnos(contenedorPagos, contenedorPaquete, Number(alumno.id_alumno))

        res.send(pagos_alumno_ret)
    } catch (e) {
        console.log(e)
        res.send(false)
    }

})


api.get(`/getPagos/`, (req, res) => {
    let alumnos = contenedorAlumno.getAlumnos()
    let pagos_retorno = alumnos.map(al => ({id_alumno:al.id_alumno, pagos: mediadorPagosPaqueteAlumnos(contenedorPagos, contenedorPaquete, Number(al.id_alumno))}))
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
    // console.log(`GET TURNOS - ENVIANDO`)

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

    console.log("mainapi crear:", req.body) // objeto json con el turno
    let alumno_id, usuario_id, fechaHoraInicio, fechaHoraFin;
    ({alumno_id, usuario_id, fechaHoraInicio, fechaHoraFin} = req.body)

    try {

        // El " / 60000" es para convertir de milisegundos a minutos.
        let duracionClase = ((Number(Turno.convertirFechaStringADate(fechaHoraFin).getTime()) - Number(Turno.convertirFechaStringADate(fechaHoraInicio).getTime())) / 60000)

        // patron de mediador
        if (contenedorProfesor.getProfesor({id_usuario: usuario_id}).verificarDispHoraria(Turno.convertirFechaStringADate(fechaHoraInicio), duracionClase)) {

            let alumno = contenedorAlumno.getAlumno({id_alumno: alumno_id})

            // devolvemos la respuesta de la creacion de turno, "true" o "false"
            res.send(contenedorTurno.crearTurno(alumno_id, usuario_id, fechaHoraInicio, fechaHoraFin, 1, alumno, duracionClase))

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
        console.log("mainapi editar paquete:", req.body)

        // El " / 60000" es para convertir de milisegundos a minutos.
        let duracionClase = ((Number(Turno.convertirFechaStringADate(req.body.fechaHoraFin).getTime()) - Number(Turno.convertirFechaStringADate(req.body.fechaHoraInicio).getTime())) / 60000)

        if (contenedorProfesor.getProfesor({id_usuario: req.body.usuario_id}).verificarDispHoraria(Turno.convertirFechaStringADate(req.body.fechaHoraInicio), duracionClase)) {
            res.send(contenedorTurno.editarTurno(req.body))

        } else {
            res.send(false)
        }
    } catch (e) {
        console.log(e)
    }
})


api.delete("/eliminarTurno/", (req, res) => {

    try {
        console.log("ELIMINAR TURNO:", req.query.id_turno)
        let alum =  contenedorAlumno.getAlumno({id_alumno: Number(req.query.alumno_id)});
        let duracionClase = ((Number(Turno.convertirFechaStringADate(req.query.fechaHoraFin).getTime()) - Number(Turno.convertirFechaStringADate(req.query.fechaHoraInicio).getTime())) / 60000)
        alum.devolverClase(duracionClase)
        res.send(contenedorTurno.eliminarTurno(req.query))
    } catch (e) {
        console.log(e)
    }
})

api.get(`/getAlumnos/`, (req, res) => {
    let alumnos_retorno = contenedorAlumno.getAlumnos()
    // console.log(`GET ALUMNOS - ENVIANDO`)
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

api.get("/eliminarCheckAlumno/", (req, res) => {


    let alumno = JSON.parse(req.query.alumno)

    //Check cuando el alumno puede ser eliminado
    //No tenga pagos pendientes
    //No tenga clases pendientes

    let pendientes = contenedorPagos.getPagosAlumno(alumno).filter(p => p.pagado === 0)
    if ( pendientes.length === 0 && alumno.cantClasesRestantes === 0) {
        // console.log(pendientes.length, alumno.cantClasesRestantes)
        //TODO TESTING
        res.send(true)
    } else {
        res.send(false)
    }

    // let paquetes = [];
    // contenedorPagos.getPagosAlumno(alumno).map(pago => {
    //     if (!paquetes.includes(pago.paquete_id)) {
    //         paquetes.push(pago.paquete_id)
    //     }
    // })
    // // console.log(paquetes)
    //
    // paquetes.map(paqId => {
    //     let paquete = contenedorPaquete.getPaquete(paqId)
    //     // console.log(paqId, paquete)
    //     let primerPago = contenedorPagos.getPrimerPago(alumno, paquete)
    //     console.log(primerPago)
    // })

    console.log(`CHECK ELIMINAR ALUMNO - ${alumno.id_alumno} - ${pendientes.length}&${alumno.cantClasesRestantes}`)
})

api.delete("/eliminarAlumno/", (req, res) => {

    console.log(`ELIMINAR ALUMNO - ${req.query.id_alumno}`)

    try {
        contenedorAlumno.eliminarAlumno({id_alumno: Number(req.query.id_alumno)});
        contenedorTurno.eliminarTurnosAlumno({id_alumno: Number(req.query.id_alumno)});
        res.send(true)
    } catch (e) {
        console.log(e)
    }

})

api.get("/getProfesores/", (req, res) => {
    let profesores_retorno = contenedorProfesor.getProfesores()
    // console.log("GET PROFESORES - ENVIANDO")
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

    try {
        console.log(`CREAR PAQUETE - ${req.body}`)
        let nombre, cantClases, durClases, precio;
        ({nombre, cantClases, durClases, precio} = req.body)
        contenedorPaquete.crearPaquete(nombre, Number(cantClases), Number(durClases), Number(precio)).then(paquetes => {
            res.send(paquetes)
        })
    } catch (e) {
        console.log(e)
    }

})


api.post("/editarPaquete/", (req, res) => {


    try {
        console.log(`EDITAR PAQUETE - ${req.body.id_paquete}`)
        let paquetes = contenedorPaquete.editarPaquete(req.body)
        res.send(paquetes)
    } catch (e) {
        console.log(e)
    }

})

api.delete("/eliminarPaquete/", (req, res) => {


    try {
        console.log(`ELIMINAR PAQUETE - ${req.query.id_paquete}`)
        let paquetes = contenedorPaquete.eliminarPaquete({id_paquete: Number(req.query.id_paquete)})
        res.send(paquetes)
    } catch (e) {
        console.log(e)
    }

})

