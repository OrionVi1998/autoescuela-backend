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

    /*
    getTurno() {
    }

    crearTurno() {
    }

    editarTurno() {}
    guardarTurno() {}

    verificarCompatHoraria() {}
    marcarTurnosIncompat() {
        // storebroker = getTurnos(...)
    }

    desvincularProfesor() {}
    tieneTurnosRestantes() {}
    verificarPoliticaCancel() {}
    */

}

let tr = new Turno(
    5,
    2,
    4,
    "04:30:00",
    "03:30:00"
)

// ContenedorTurno.build().then(ct => {
//     console.log(ct)
//     // ct.crearTurno(tr.alumno_id, tr.usuario_id, tr.fechaHoraInicio, tr.fechaHoraFin)
//     // ct.editarTurno(tr)
//     // ct.eliminarTurno(tr)
//     console.log(ct)
// })


module.exports = {Turno, ContenedorTurno: ContenedorTurno}
