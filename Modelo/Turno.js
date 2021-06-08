const Storebroker = require('./storebroker')


class ContenedorTurnos {

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
                    t.horaInicio,
                    t.horaFin
               )
            })
            return new ContenedorTurnos(async_result)

        } catch (err) {
            throw err
        }
    }

    getTurnos() {
        return this.turnos
    }

    crearTurno(alumno_id, usuario_id, horaInicio, horaFin) {

        let tur = new Turno(
            500,
            alumno_id,
            usuario_id,
            horaInicio,
            horaFin
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
    horaInicio;
    horaFin;

    constructor(id_turno, alumno_id, usuario_id, horaInicio, horaFin) {
        this.id_turno = id_turno
        this.alumno_id = alumno_id
        this.usuario_id = usuario_id
        this.horaInicio = horaInicio
        this.horaFin = horaFin
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

ContenedorTurnos.build().then(ct => {
    console.log(ct)
    // ct.crearTurno(tr.alumno_id, tr.usuario_id, tr.horaInicio, tr.horaFin)
    // ct.editarTurno(tr)
    // ct.eliminarTurno(tr)
    console.log(ct)
})


module.exports = {Turno, ContenedorTurnos}
