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
                    t.fechaHoraFin
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

    crearTurno(alumno_id, usuario_id, fechaHoraInicio, fechaHoraFin) {

        let tur = new Turno(
            500,
            alumno_id,
            usuario_id,
            fechaHoraInicio,
            fechaHoraFin
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

        Storebroker.eliminarTurno(turno)

        this.turnos = this.turnos.filter(
            t => t.id_turno !== turno.id_turno
        );
    }

}


class Turno {

    id_turno;
    alumno_id;
    usuario_id;
    fechaHoraInicio;
    fechaHoraFin;

    constructor(id_turno, alumno_id, usuario_id, fechaHoraInicio, fechaHoraFin) {
        this.id_turno = id_turno
        this.alumno_id = alumno_id
        this.usuario_id = usuario_id
        this.fechaHoraInicio = fechaHoraInicio
        this.fechaHoraFin = fechaHoraFin
    }

    verificarCompatHoraria(turno) {

        /* Primero construimos los objetos Date
         * asi podemos acceder a la funcionalidad de comparacion
         */

        // separamos el string "YY-MM-dd HH:mm:ss" en dos por el espacio
        let datetimeTurnoInicio = turno.fechaHoraInicio.split(' ')
        // agarramos la parte 'date' que seria YY-MM-dd
        let dateTurnoInicio = datetimeTurnoInicio[0]
        // agarramos la parte 'time' que seria HH:mm:ss
        let timeTurnoInicio = datetimeTurnoInicio[1]
        // construimos el objeto de Date
        let reservaTurnoInicio = new Date(dateTurnoInicio.split('-')[0],
            dateTurnoInicio.split('-')[1],
            dateTurnoInicio.split('-')[2],
            timeTurnoInicio.split(':')[0],
            timeTurnoInicio.split(':')[1],
            timeTurnoInicio.split(':')[2])

        let datetimeTurnoFin = turno.fechaHoraFin.split(' ')
        let dateTurnoFin = datetimeTurnoFin[0]
        let timeTurnoFin = datetimeTurnoFin[1]
        let reservaTurnoFin = new Date(dateTurnoFin.split('-')[0],
            dateTurnoFin.split('-')[1],
            dateTurnoFin.split('-')[2],
            timeTurnoFin.split(':')[0],
            timeTurnoFin.split(':')[1],
            timeTurnoFin.split(':')[2])

        // separamos el string "YY-MM-dd HH:mm:ss" en dos por el espacio
        let datetimeThisTurnoInicio = this.fechaHoraInicio.split(' ')
        // agarramos la parte 'date' que seria YY-MM-dd
        let dateThisTurnoInicio = datetimeThisTurnoInicio[0]
        // agarramos la parte 'time' que seria HH:mm:ss
        let timeThisTurnoInicio = datetimeThisTurnoInicio[1]
        // construimos el objeto de Date
        let reservaThisTurnoInicio = new Date(dateThisTurnoInicio.split('-')[0],
            dateThisTurnoInicio.split('-')[1],
            dateThisTurnoInicio.split('-')[2],
            timeThisTurnoInicio.split(':')[0],
            timeThisTurnoInicio.split(':')[1],
            timeThisTurnoInicio.split(':')[2])

        let datetimeThisTurnoFin = this.fechaHoraFin.split(' ')
        let dateThisTurnoFin = datetimeThisTurnoFin[0]
        let timeThisTurnoFin = datetimeThisTurnoFin[1]
        let reservaThisTurnoFin = new Date(dateThisTurnoFin.split('-')[0],
            dateThisTurnoFin.split('-')[1],
            dateThisTurnoFin.split('-')[2],
            timeThisTurnoFin.split(':')[0],
            timeThisTurnoFin.split(':')[1],
            timeThisTurnoFin.split(':')[2])

        /* Terminamos de construir */

        // si tienen el mismo DateTime, entonces no se puede reservar el turno
        if (reservaThisTurnoInicio.getTime() == reservaTurnoInicio.getTime()) {
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

        // separamos el string "YY-MM-dd HH:mm:ss" en dos por el espacio
        let datetimeTurnoInicio = turno.fechaHoraInicio.split(' ')
        // agarramos la parte 'date' que seria YY-MM-dd
        let dateTurnoInicio = datetimeTurnoInicio[0]
        // agarramos la parte 'time' que seria HH:mm:ss
        let timeTurnoInicio = datetimeTurnoInicio[1]
        // construimos el objeto de Date
        let reservaTurnoInicio = new Date(dateTurnoInicio.split('-')[0],
            dateTurnoInicio.split('-')[1],
            dateTurnoInicio.split('-')[2],
            timeTurnoInicio.split(':')[0],
            timeTurnoInicio.split(':')[1],
            timeTurnoInicio.split(':')[2])

        // separamos el string "YY-MM-dd HH:mm:ss" en dos por el espacio
        let datetimeThisTurnoInicio = this.fechaHoraInicio.split(' ')
        // agarramos la parte 'date' que seria YY-MM-dd
        let dateThisTurnoInicio = datetimeThisTurnoInicio[0]
        // agarramos la parte 'time' que seria HH:mm:ss
        let timeThisTurnoInicio = datetimeThisTurnoInicio[1]
        // construimos el objeto de Date
        let reservaThisTurnoInicio = new Date(dateThisTurnoInicio.split('-')[0],
            dateThisTurnoInicio.split('-')[1],
            dateThisTurnoInicio.split('-')[2],
            timeThisTurnoInicio.split(':')[0],
            timeThisTurnoInicio.split(':')[1],
            timeThisTurnoInicio.split(':')[2])

        if (reservaThisTurnoInicio.getYear() === reservaTurnoInicio.getYear() &&
            reservaThisTurnoInicio.getMonth() === reservaTurnoInicio.getMonth()) {

            if ((reservaThisTurnoInicio.getDay() - reservaTurnoInicio.getDay()) >= 1) {
                return true;
            }

            return false;
        }

        marcarTurnosIncompat()
        {
            // storebroker = getTurnos(...)
        }

        desvincularProfesor()
        {
        }
        tieneTurnosRestantes()
        {
        }

    }

}

// let tr = new Turno(
//     9,
//     2,
//     4,
//     "2021-06-08 07:30:00",
//     "2021-06-08 08:30:00"
// )


// ContenedorTurno.build().then(ct => {
//     console.log(ct)
//     // ct.crearTurno(tr.alumno_id, tr.usuario_id, tr.fechaHoraInicio, tr.fechaHoraFin)
//     // ct.editarTurno(tr)
//     // ct.eliminarTurno(tr)
//     console.log(ct)
// })


module.exports = {Turno, ContenedorTurno: ContenedorTurno}
