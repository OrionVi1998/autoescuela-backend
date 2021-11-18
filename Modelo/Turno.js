const Storebroker = require('./storebroker')
let moment = require('moment'); // require

class ContenedorTurno {

    turnos;

    constructor(turnos) {
        if (typeof turnos === 'undefined') {
            console.log("Parametro de constructor indefinido")
        } else {
            this.turnos = turnos
        }
    }


    static async build() {
        try {
            let async_result = await Storebroker.getTurnos()
            async_result = async_result.map(t => {


                return new Turno(
                    t.ID_TURNO,
                    t.ALUMNO_ID,
                    t.USUARIO_ID,
                    t.fechaHoraInicio,
                    t.fechaHoraFin,
                    t.profesorPresente
                )
            })

            return new ContenedorTurno(async_result)

        } catch (err) {
            throw err
        }
    }


    getTurnos() {
        return this.turnos
    }


    getTurnosProfesor(profesor) {
        return this.turnos.filter(t => t.usuario_id === profesor.id_usuario)
    }

    getTurnosAlumno(alumno) {
        return this.turnos.filter(t => t.alumno_id === alumno.id_alumno)
    }


    crearTurno(alumno_id, usuario_id, fechaHoraInicio, fechaHoraFin, profesorPresente, alumno, duracionClase) {

        return new Promise((resolve, reject) => {
            try {
                let tur = new Turno(
                    500,
                    alumno_id,
                    usuario_id,
                    moment(fechaHoraInicio).toDate(),
                    moment(fechaHoraFin).toDate(),
                    profesorPresente
                );

                //console.log("contenedorturno crear:", tur)
                // chequeamos de que no haya turnos que se superpongan con el que estamos tratando de agendar
                let profesorDisponib = this.getTurnosProfesor({id_usuario: tur.usuario_id}).every(t => (tur.verificarCompatHoraria(t)))
                let alumnoDisponib = this.getTurnosAlumno({id_alumno: tur.alumno_id}).every(t => (tur.verificarCompatHoraria(t)))
                // console.log(this.getTurnosAlumno({id_alumno: tur.alumno_id}))


                if (profesorDisponib && alumnoDisponib) {
                    if (alumno.cantMinutosClaseRestantes - duracionClase < 0) {
                        resolve({
                            success: false,
                            value: {content: "El alumno no tiene suficente tiempo comprado"}
                        })
                    } else {
                        Storebroker.crearTurno(tur).then(r => {
                            alumno.usarClase(duracionClase)
                            tur.id_turno = r
                            this.turnos.push(tur)
                            resolve({success: true})
                        })
                    }
                } else {
                    resolve({
                        success: false,
                        value: {content: "El alumno o el profesor ya cuentan con un turno en ese horario"}
                    })
                }
            } catch (e) {
                console.log(e)
                reject(e)
            }
        })
    }


    async editarTurno(turno) {


        return new Promise((resolve, reject) => {
            try {
                let oldTurno = this.turnos.find(t => turno.id_turno === t.id_turno)
                Object.keys(oldTurno).map(k => {
                    if (typeof turno[k] === 'undefined') {
                        turno[k] = oldTurno[k]
                    } else {
                        turno[k] = turno[k]
                    }
                })

                Storebroker.editarTurno(turno).then(id => {
                    let editadoConExito = false
                    this.turnos = this.turnos.map(t => {
                        if (t.id_turno === turno.id_turno) {
                            editadoConExito = true
                            return new Turno(turno.id_turno,
                                turno.alumno_id,
                                turno.usuario_id,
                                moment.utc(turno.fechaHoraInicio).toDate(),
                                moment.utc(turno.fechaHoraFin).toDate(),
                                turno.profesorPresente)
                        } else {
                            return t
                        }
                    });

                    resolve(editadoConExito)
                })
            } catch (e) {
                reject(e)
            }
        })

    }


    eliminarTurno(turno) {

        //console.log("contendor eliminar:", turno)
        if (this.verificarPoliticaCancel(turno)) {

            Storebroker.eliminarTurno(turno)

            this.turnos = this.turnos.filter(
                t => t.id_turno !== Number(turno.id_turno) // debemos hacer el Number(tur...) porque `turno` llega como string
            );

            return true;

        } else {
            return false
        }

    }


    verificarPoliticaCancel(turno) {

        /* Primero construimos los objetos Date
        * asi podemos acceder a la funcionalidad de comparacion
         */

        // separamos el string "YY-MM-dd HH:mm:ss" en dos por el espacio
        let reservaTurnoInicio = moment(turno.fechaHoraInicio).toDate()

        // recibimos la fecha y la hora del 'presente', 'ahora', 'en este preciso instante'
        let datetimeAhora = moment().toDate();
        // le restamos 1 al indice del mes porque cuando se convierte Date -> string, se suma 1 al indice; lo tenemos que volver a restar
        // datetimeAhora.setUTCMonth(datetimeAhora.getUTCMonth() - 1)
        // console.log("datetimeahora:", datetimeAhora)
        // console.log("reservaturnoinicio:", reservaTurnoInicio)

        let tiempoHastaInicio = (reservaTurnoInicio.getTime() - datetimeAhora.getTime()) / 86400000
        return (tiempoHastaInicio >= 1)

    }


    desvincularProfesor(profesor) {
        //DESPUES DE eliminarlo
        this.turnos = this.turnos.map(t => {
            if (t.usuario_id === profesor.id_usuario) {
                t.usuario_id = null
                t.profesorPresente = 0
                return t
            } else {
                return t
            }
        })
    }


    async desvincularTrunosIncompatProfesor(profesor) {

        await Promise.all(
            this.turnos.filter(t => t.usuario_id === profesor.id_usuario).map(t => {

                console.log(profesor)

                let tHoraInicio = new Date()
                tHoraInicio.setHours(
                    t.fechaHoraInicio.getHours(),
                    t.fechaHoraInicio.getMinutes(),
                    0
                )


                let tHoraFin = new Date()
                tHoraFin.setHours(
                    t.fechaHoraFin.getHours(),
                    t.fechaHoraFin.getMinutes(),
                    0
                )

                // let pDispHoraInicio = profesor.horaInicio.split(":")
                // let pDispHoraFin = profesor.horaFin.split(":")
                //
                // pDispHoraInicio = new Date()
                // pDispHoraInicio.setHours(
                //     Number(profesor.horaInicio.split(":")[0]),
                //     Number(profesor.horaInicio.split(":")[1]),
                //     0
                // )
                // pDispHoraFin = new Date()
                // pDispHoraFin.setHours(
                //     Number(profesor.horaFin.split(":")[0]),
                //     Number(profesor.horaFin.split(":")[1]),
                //     0
                // )

                let pDispHoraInicio = moment.utc([new Date().getFullYear(),
                    new Date().getMonth(),
                    new Date().getDate(),
                    Number(profesor.horaInicio.split(":")[0]),
                    Number(profesor.horaInicio.split(":")[1]),
                    0]).toDate()

                let pDispHoraFin = moment.utc([new Date().getFullYear(),
                    new Date().getMonth(),
                    new Date().getDate(),
                    Number(profesor.horaFin.split(":")[0]),
                    Number(profesor.horaFin.split(":")[1]),
                    0]).toDate()

                console.log(pDispHoraInicio, pDispHoraFin, tHoraInicio, tHoraFin)

                if (pDispHoraInicio.getTime() <= tHoraInicio.getTime()) { //
                    if (pDispHoraFin.getTime() >= tHoraFin.getTime()) {
                        console.log(`DESV. TURNO ${t.id_turno} de profesor ${profesor.usuario_id}`)
                        t.usuario_id = null
                        return this.editarTurno(t)
                    }
                } else {
                    console.log(`DESV. TURNO ${t.id_turno} de profesor ${profesor.usuario_id}`)
                    t.usuario_id = null
                    return this.editarTurno(t)
                }
            })
        )
    }


    tieneTurnosRestantes(alumno) {

        return this.turnos.filter(t => t.alumno_id === alumno.id_alumno).length !== 0
    }


    eliminarTurnosAlumno(id_alumno) {
        this.turnos.map(t => {
            if (t.alumno_id === id_alumno) {
                Storebroker.eliminarTurno(t);
            }
        })
        this.turnos = this.turnos.filter(t => t.alumno_id !== id_alumno)
    }


}


class Turno {

    id_turno;
    alumno_id;
    usuario_id;
    fechaHoraInicio;
    fechaHoraFin;
    profesorPresente; // FIXME: Tal vez redundante

    constructor(id_turno, alumno_id, usuario_id, fechaHoraInicio, fechaHoraFin, profesorPresente) {
        this.id_turno = id_turno
        this.alumno_id = alumno_id
        this.usuario_id = usuario_id
        this.fechaHoraInicio = fechaHoraInicio
        this.fechaHoraFin = fechaHoraFin
        this.profesorPresente = profesorPresente
    }


    verificarCompatHoraria(turno) {

        if (this.fechaHoraInicio.getTime() > turno.fechaHoraInicio.getTime()) { //
            return turno.fechaHoraFin.getTime() <= this.fechaHoraInicio.getTime() //
        } else {
            return this.fechaHoraFin.getTime() <= turno.fechaHoraInicio.getTime() //
        }

        // return (
        //     this.fechaHoraFin.getTime() <= turno.fechaHoraInicio.getTime() ||
        //     this.fechaHoraInicio.getTime() >= turno.fechaHoraFin.getTime()
        // )

    }

}


// let tr = new Turno(
//     13,
//     2,
//     4,
//     "2021-08-09 09:30:00",
//     "2021-08-09 10:30:00",
//     1
// )

// let tr2 = new Turno(
//     9,
//     2,
//     4,
//     "2021-06-08 15:30:00",
//     "2021-06-08 17:00:00"
// )
//
// ContenedorTurno.build().then(ct => {
//     // console.log(ct)
//     // ct.crearTurno(tr.alumno_id, tr.usuario_id, tr.fechaHoraInicio, tr.fechaHoraFin, tr.profesorPresente)
//     // ct.editarTurno(tr)
//     // ct.eliminarTurno(tr)
//     // console.log(ct.verificarPoliticaCancel(tr))
//     // console.log(ct)
//     // console.log(ct.tieneTurnosRestantes({id_alumno: 2}))
// })


module.exports = {Turno, ContenedorTurno: ContenedorTurno}
