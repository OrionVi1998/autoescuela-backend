
class ContenedorTurnos {

}


class Turno {

    id_turno;
    alumno_id;
    usuario_id;
    horaInicio;
    horaFin;

    constructor(id_turno, horaInicio, horaFin, usuario, alumno) {
        this.id_turno = id_turno
        this.horaInicio = horaInicio
        this.horaFin = horaFin
        this.usuario_id = usuario
        this.alumno_id = alumno
    }

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

}

module.exports = {Turno, ContenedorTurnos}
