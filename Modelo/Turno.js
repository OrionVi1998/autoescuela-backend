const Storebroker = require('./storebroker')

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

                // si en la base de datos tenemos una date: 2021-10-11T15:00:00.00Z, si no hacemos esta conversion
                // de horas entonces llegaria como: 2021-10-11T18:00:00.00Z
                t.fechaHoraInicio.setUTCHours(Number(t.fechaHoraInicio.getUTCHours() - 3))
                t.fechaHoraFin.setUTCHours(Number(t.fechaHoraFin.getUTCHours() - 3))

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


    crearTurno(alumno_id, usuario_id, fechaHoraInicio, fechaHoraFin, profesorPresente, alumno, duracionClase) {

        let tur = new Turno(
            500,
            alumno_id,
            usuario_id,
            Turno.convertirFechaStringADate(fechaHoraInicio),
            Turno.convertirFechaStringADate(fechaHoraFin),
            profesorPresente
        );

        //console.log("contenedorturno crear:", tur)

        let disponib = true

        // chequeamos de que no haya turnos que se superpongan con el que estamos tratando de agendar
        this.getTurnosProfesor({id_usuario: tur.usuario_id}).map(t => {

            // chequeamos de que no haya turnos que se superpongan con el que estamos tratando de agendar
            if (!(tur.verificarCompatHoraria(t))) {
                disponib = false
            }
        })

        if (disponib) {

            if (alumno.cantClasesRestantes -= 1 < 0) {
                return false

            } else if (alumno.cantMinutosClaseRestantes -= duracionClase < 0) {
                return false

            } else {
                Storebroker.crearTurno(tur).then(r => {
                    alumno.usarClase(duracionClase)
                    tur.id_turno = r
                    this.turnos.push(tur)
                    // console.log(tur.id_turno)
                })
                return true

            }

        } else {
            return false
        }
    }


    editarTurno(turno) {

        console.log("contenedorturno editar:", turno)
        Storebroker.editarTurno(turno)

        let editadoConExito = false
        this.turnos = this.turnos.map(t => {
            if (t.id_turno === turno.id_turno) {
                editadoConExito = true
                return turno
            } else {
                return t
            }
        });

        return editadoConExito
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
        let reservaTurnoInicio = Turno.convertirFechaStringADate(turno.fechaHoraInicio)

        // recibimos la fecha y la hora del 'presente', 'ahora', 'en este preciso instante'
        let datetimeAhora = new Date();
        // le restamos 1 al indice del mes porque cuando se convierte Date -> string, se suma 1 al indice; lo tenemos que volver a restar
        datetimeAhora.setUTCMonth(datetimeAhora.getUTCMonth()-1)
        console.log("datetimeahora:", datetimeAhora)
        console.log("reservaturnoinicio:", reservaTurnoInicio)

        if (datetimeAhora.getYear() <= reservaTurnoInicio.getYear() &&
            datetimeAhora.getMonth() <= reservaTurnoInicio.getMonth()) {

            if ((reservaTurnoInicio.getDate() - datetimeAhora.getDate()) >= 1) {
                return true;
            }

            return false;
        }

        return false;
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


    desvincularTrunosIncompatProfesor(profesor) {

        this.turnos.map(t => {
            if (t.usuario_id === profesor.id_usuario) {

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

                let pDispHoraInicio = profesor.horaInicio.split(":")
                let pDispHoraFin = profesor.horaFin.split(":")

                pDispHoraInicio = new Date()
                pDispHoraInicio.setHours(
                    Number(profesor.horaInicio.split(":")[0]),
                    Number(profesor.horaInicio.split(":")[1]),
                    0
                )
                pDispHoraFin = new Date()
                pDispHoraFin.setHours(
                    Number(profesor.horaFin.split(":")[0]),
                    Number(profesor.horaFin.split(":")[1]),
                    0
                )



                // console.log("---")
                // console.log(pDispHoraInicio.getHours().toString(),pDispHoraInicio.getMinutes().toString())
                // console.log(tHoraInicio.getHours().toString(),tHoraInicio.getMinutes().toString())
                // console.log(pDispHoraInicio > tHoraInicio)
                //
                // console.log(pDispHoraFin.getHours().toString(),pDispHoraFin.getMinutes().toString())
                // console.log(tHoraFin.getHours().toString(),tHoraFin.getMinutes().toString())
                // console.log(pDispHoraFin < tHoraFin)
                // console.log("---")

                if (pDispHoraInicio > tHoraInicio || pDispHoraFin < tHoraFin) {

                    console.log(`DESV. TURNO ${t.id_turno} de profesor ${profesor.usuario_id}`)

                    t.usuario_id = null
                    this.editarTurno(t)

                }
            }
        })

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

        // si tienen el mismo `datetime`, entonces no se puede reservar el turno
        if (this.fechaHoraInicio.getTime() === turno.fechaHoraInicio.getTime()) {
            return false;
        }

        // si el primer turno termina luego de que el segundo inicia
        else if (this.fechaHoraFin.getTime() < turno.fechaHoraFin.getTime() &&
                 this.fechaHoraFin.getTime() > turno.fechaHoraInicio.getTime()) {
            return false;

        } else {
            return true;
        }

    }


    verificarPoliticaCancel(turno) {

        /* Primero construimos los objetos Date
        * asi podemos acceder a la funcionalidad de comparacion
         */

        let reservaTurnoInicio = Turno.convertirFechaStringADate(turno.fechaHoraInicio)
        let reservaThisTurnoInicio = Turno.convertirFechaStringADate(this.fechaHoraInicio)

        if (reservaThisTurnoInicio.getYear() === reservaTurnoInicio.getYear() &&
            reservaThisTurnoInicio.getMonth() === reservaTurnoInicio.getMonth()) {

            if ((reservaThisTurnoInicio.getDay() - reservaTurnoInicio.getDay()) >= 1) {
                return true;
            }

            return false;
        }
    }


    static convertirFechaStringADate(fechaHoraString) {

        if (fechaHoraString.includes(" ")) {

            // separamos el string "YY-MM-dd HH:mm:ss" en dos por el espacio
            let datetimeTurno = fechaHoraString.split(' ')
            // agarramos la parte 'date' que seria YY-MM-dd
            let dateTurno = datetimeTurno[0]
            // agarramos la parte 'time' que seria HH:mm:ss
            let timeTurno = datetimeTurno[1]

            // construimos el objeto de Date forzando la conversion a Number
            // el -3 es para pasar el horario a GMT-3
            // el -1 es porque para Javascript, los indices de los meses empiezan en 0
            return new Date(Number(dateTurno.split('-')[0]),
                            Number(dateTurno.split('-')[1])-1,
                            Number(dateTurno.split('-')[2]),
                            Number(timeTurno.split(':')[0])-3,
                            Number(timeTurno.split(':')[1]),
            0)

        } else if (fechaHoraString.includes("T")) {

            // separamos el string "YY-MM-ddTHH:mm:ss" en dos por la T
            let datetimeTurno = fechaHoraString.split('T')
            // agarramos la parte 'date' que seria YY-MM-dd
            let dateTurno = datetimeTurno[0]
            // agarramos la parte 'time' que seria HH:mm:ss
            let timeTurno = datetimeTurno[1]

            // construimos el objeto de Date forzando la conversion a Number
            // el -3 es para pasar el horario a GMT-3
            // el -1 es porque para Javascript, los indices de los meses empiezan en 0
            return new Date(Number(dateTurno.split('-')[0]),
                            Number(dateTurno.split('-')[1])-1,
                            Number(dateTurno.split('-')[2]),
                            Number(timeTurno.split(':')[0])-3,
                            Number(timeTurno.split(':')[1]),
            0)

        } else {
            // si fechaHoraString no contiene un espacio o una 'T' probablemente no sea un String, sino un Date
            return fechaHoraString
        }

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
