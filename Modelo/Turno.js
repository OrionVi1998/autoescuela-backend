
class Turno {

    id_turno;
    horaInicio;
    horaFin;
    usuario;
    alumno;

    constructor(id_turno, horaInicio, horaFin, usuario, alumno) {
        this.id_turno = id_turno
        this.horaInicio = horaInicio
        this.horaFin = horaFin
        this.usuario = usuario
        this.alumno = alumno
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

export default Turno
