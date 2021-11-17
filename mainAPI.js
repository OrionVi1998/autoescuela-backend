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
let moment = require('moment'); // require

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

    if (admin) {
        res.send({session: true, credencial: admin.credencial})
    } else if (profesor) {
        res.send({session: true, credencial: profesor.credencial})
    } else {
        res.send({session: false})
    }
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

        contenedorPagos.generarPagos(paqueteAsociar, alumno).then(() => {
            let clasesAgregar = paqueteAsociar.cantClases

            while (clasesAgregar !== 0) {
                clasesAgregar -= 1
                alumno.devolverClase(paqueteAsociar.durClases)
            }

            let pagos_alumno_ret = mediadorPagosPaqueteAlumnos(contenedorPagos, contenedorPaquete, Number(alumno.id_alumno))

            res.send(pagos_alumno_ret)
        })

    } catch (e) {
        console.log(e)
        res.send(false)
    }

})


api.get(`/getPagos/`, (req, res) => {
    let alumnos = contenedorAlumno.getAlumnos()
    let pagos_retorno = alumnos.map(al => ({
        id_alumno: al.id_alumno,
        pagos: mediadorPagosPaqueteAlumnos(contenedorPagos, contenedorPaquete, Number(al.id_alumno))
    }))
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
    try {
        console.log(`GET TURNOS - ENVIANDO`)
        let turnos_retorno = contenedorTurno.getTurnos()

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
    } catch (e) {
        console.log(e)
    }


})

api.put(`/crearTurno/`, (req, res) => {

    try {
        console.log("CREAR TURNO", req.body) // objeto json con el turno
        let alumno_id, usuario_id, fechaHoraInicio, fechaHoraFin;
        ({alumno_id, usuario_id, fechaHoraInicio, fechaHoraFin} = req.body)


        // El " / 60000" es para convertir de milisegundos a minutos.
        let duracionClase = (moment(fechaHoraFin).toDate().getTime() - moment(fechaHoraInicio).toDate().getTime()) / 60000
        let profesor = contenedorProfesor.getProfesor({id_usuario: usuario_id})

        console.log(profesor)

        if (profesor.verificarDispHoraria(moment(fechaHoraInicio).toDate(), duracionClase)) {

            let alumno = contenedorAlumno.getAlumno({id_alumno: alumno_id})

            contenedorTurno.crearTurno(alumno_id, usuario_id, fechaHoraInicio, fechaHoraFin, 1, alumno, duracionClase)
            .then(r => {
                res.send(r)
            }).catch(e => {
                throw (e)
            })
        } else {
            // si no hay disponibilidad horaria del profesor, devolvemos false
            res.send({
                success: false,
                value: {content: "El profesor no se encuentra disponible en este horario."}
            })
        }
    } catch (e) {
        console.log(e)
        res.send(false)
    }
})

api.post(`/editarTurno/`, (req, res) => {

    try {
        console.log("EDITAR TURNO:", req.body)

        // El " / 60000" es para convertir de milisegundos a minutos.
        // let duracionClase = ((Number(Turno.convertirFechaStringADate(req.body.fechaHoraFin).getTime() - Number(Turno.convertirFechaStringADate(req.body.fechaHoraInicio).getTime())) / 60000))
        let duracionClase = (moment(req.body.fechaHoraFin).toDate().getTime() - moment(req.body.fechaHoraInicio).toDate().getTime()) / 60000


        let profesor = contenedorProfesor.getProfesor({id_usuario: req.body.usuario_id});
        let alumno = contenedorAlumno.getAlumno({id_alumno: req.body.alumno_id})
        if (profesor.verificarDispHoraria(moment(req.body.fechaHoraInicio).toDate(), duracionClase)) {

            let tur = contenedorTurno.turnos.find(t => req.body.id_turno === t.id_turno)
            let turnosCheck = contenedorTurno.getTurnos().filter(t => t.id_turno !== tur.id_turno)

            let minutosOriginales = (moment(tur.fechaHoraFin).toDate().getTime() - moment(tur.fechaHoraInicio).toDate().getTime()) / 60000
            let diffTurnos = duracionClase - minutosOriginales

            if (diffTurnos < 0) {
                alumno.devolverClase(Math.abs(diffTurnos))
            } else if (diffTurnos > 0 && alumno.cantMinutosClaseRestantes >= Math.abs(diffTurnos)) {
                alumno.usarClase(Math.abs(diffTurnos))
            } else if (alumno.cantMinutosClaseRestantes < Math.abs(diffTurnos)) {
                res.send({
                    success: false,
                    value: {content: "El alumno no tiene tiempo suficiente para esta clase"}
                })
                return;
            }

            let profesorDisponib = turnosCheck.filter(t => t.usuario_id === profesor.id_usuario).every(t => (tur.verificarCompatHoraria(t)))
            let alumnoDisponib = turnosCheck.filter(t => t.alumno_id === alumno.id_alumno).every(t => (tur.verificarCompatHoraria(t)))

            if (profesorDisponib && alumnoDisponib) {
                let editarTurno = contenedorTurno.editarTurno(req.body)
                res.send({
                    success: true,
                    value: {content: ""}
                })
            } else {
                res.send({
                    success: false,
                    value: {content: "El profesor o alumno no se encuentra disponible"}
                })
            }
        } else {
            res.send({
                success: false,
                value: {content: "El profesor no atiende en esa hora"}
            })
        }
    } catch (e) {
        console.log(e)
    }
})


api.delete("/eliminarTurno/", (req, res) => {

    try {
        console.log("ELIMINAR TURNO:", req.query.id_turno)
        let alum = contenedorAlumno.getAlumno({id_alumno: Number(req.query.alumno_id)});
        let duracionClase = (moment(req.query.fechaHoraFin).toDate().getTime() - moment(req.query.fechaHoraInicio).toDate().getTime()) / 60000
        console.log(duracionClase)
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

    // Check si el alumno puede ser eliminado
    try {
        let alumno = JSON.parse(req.query.alumno)

        // console.log("eliminar alumno id:", alumno.id_alumno)
        let esPosibleEliminar = true

        if (contenedorPagos.getPagosAlumno(alumno).filter(p => p.pagado === 0).length > 0) {
            esPosibleEliminar = false
        }

        // chequeamos que el alumno no tenga tiempo restante de clases
        if (alumno.cantMinutosClaseRestantes > 0) {
            esPosibleEliminar = false
        }

        // chequeamos que el alumno no tenga clases pendientes
        let arrayTurnosAlumno = contenedorTurno.getTurnosAlumno(alumno)
        let fechaAhora = new Date()
        arrayTurnosAlumno.map(tur => {
            if (tur.fechaHoraInicio.getTime() > fechaAhora.getTime()) {
                esPosibleEliminar = false
            }
        })

        // console.log("eliminar alumno id:", alumno.id_alumno, "esPosibleEliminar:", esPosibleEliminar)
        res.send(esPosibleEliminar)

    } catch (e) {
        console.log(e)
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

})

api.delete("/eliminarAlumno/", (req, res) => {


    try {

        console.log(`ELIMINAR ALUMNO - ${req.query.id_alumno}`)
        contenedorTurno.eliminarTurnosAlumno(Number(req.query.id_alumno));
        contenedorAlumno.eliminarAlumno({id_alumno: Number(req.query.id_alumno)});
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
    try {
        console.log(`CREAR_PROFESOR - ${req.body.apellido}`) // objeto json con el profesor
        contenedorProfesor.crearProfesor(
            req.body.email,
            req.body.nombre,
            req.body.apellido,
            req.body.telefono,
            req.body.direccion,
            req.body.horaInicio,
            req.body.horaFin
        ).then(profesores => {
            res.send(profesores)
        })
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
    } catch (e) {
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

