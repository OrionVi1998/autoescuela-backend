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


    crearTurno(alumno_id, usuario_id, fechaHoraInicio, fechaHoraFin, profesorPresente) {

        let tur = new Turno(
            500,
            alumno_id,
            usuario_id,
            fechaHoraInicio,
            fechaHoraFin,
            profesorPresente
        );

        Storebroker.crearTurno(tur).then(r => {
            tur.id_turno = r
            this.turnos.push(tur)
            console.log(tur.id_turno)
        })
    }


    editarTurno(turno) {

        Storebroker.editarTurno(turno)

        this.turnos = this.turnos.map(t => {
            if (t.id_turno === turno.id_turno) {
                return turno
            } else {
                return t
            }
        });
    }


    eliminarTurno(turno) {

        if (this.verificarPoliticaCancel(turno)) {

            Storebroker.eliminarTurno(turno)

            this.turnos = this.turnos.filter(
                t => t.id_turno !== turno.id_turno
            );

        } else {
            console.log("Este turno no puede ser cancelado.\n Por favor cancelar con 24hs de anticipacion.");
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

        if (datetimeAhora.getYear() <= reservaTurnoInicio.getYear() &&
            datetimeAhora.getMonth() <= reservaTurnoInicio.getMonth()) {

            if ((datetimeAhora.getDay() - reservaTurnoInicio.getDay()) >= 1) {
                return true;
            }

            return false;
        }
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


    tieneTurnosRestantes(alumno) {

        return this.turnos.filter(t => t.alumno_id === alumno.id_alumno).length !== 0
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

        /* Primero construimos los objetos Date
         * asi podemos acceder a la funcionalidad de comparacion
         */
        let reservaTurnoInicio = Turno.convertirFechaStringADate(turno.fechaHoraInicio)
        let reservaTurnoFin = Turno.convertirFechaStringADate(turno.fechaHoraFin)

        let reservaThisTurnoInicio = Turno.convertirFechaStringADate(this.fechaHoraInicio)
        let reservaThisTurnoFin = Turno.convertirFechaStringADate(this.fechaHoraFin)
        /* Terminamos de construir */

        // si tienen el mismo DateTime, entonces no se puede reservar el turno
        if (reservaThisTurnoInicio.getTime() === reservaTurnoInicio.getTime()) {
            return false;

        } else if (reservaThisTurnoFin.getTime() < reservaTurnoFin.getTime() &&
            reservaThisTurnoFin.getTime() > reservaTurnoInicio.getTime()) { // si el primer turno termina luego de que el segundo inicia
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

        let datetimeTurno = fechaHoraString.split(' ')
        // separamos el string "YY-MM-dd HH:mm:ss" en dos por el espacio
        let dateTurno = datetimeTurno[0]
        // agarramos la parte 'time' que seria HH:mm:ss
        let timeTurno = datetimeTurno[1]

        // construimos el objeto de Date
        return new Date(dateTurno.split('-')[0],
            dateTurno.split('-')[1],
            dateTurno.split('-')[2],
            timeTurno.split(':')[0],
            timeTurno.split(':')[1],
           0)
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
