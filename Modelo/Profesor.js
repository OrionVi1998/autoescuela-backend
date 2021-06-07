
const Usuario = require("./Usuario")

class ContenedorProfesor {

}


class Profesor extends Usuario {
    nombre;
    apellido;
    telefono;
    direccion;
    horaInicio;
    horaFin;

    constructor(id_usuario, email, credencial, nombre, apellido, telefono, direccion, horaInicio, horaFin) {
        super(id_usuario, email, credencial);
        this.nombre = nombre
        this.apellido = apellido
        this.telefono = telefono
        this.direccion = direccion
        this.horaInicio = horaInicio
        this.horaFin = horaFin

        // new Date(year, monthIndex, day, hours, minutes, seconds, milliseconds)
        // this.horaInicio = new Date(2021, 1, 1, 8, 30, 0, 0)

    }

    // aunque este metodo no deberia pertenecer a profesores, lo dejamos aca para mas claridad
    getProfesores() {
        // Controller -> Storebroker -> Retorna una lista con objetos Usuario
    }

    guardarProfesor() {

    }

    editarProfesor() {

    }

    eliminarProfesor() {

    }

    // Seguro pertenecen

    autorizarEmail() {

    }

    // Retorna True si puede tener turno en esta hora
    verificarDispHoraria(horacheck, duracionClase) {

        if (this.horaInicio < horacheck && (horacheck + duracionClase) < this.horaFin) {

            // Check Turnos
            // Si turno overlap -> False
            // Else True

        } else {
            return false
        }
    }
}

module.exports = Profesor
