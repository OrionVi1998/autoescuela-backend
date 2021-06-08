
const Usuario = require("./Usuario")
const Storebroker = require("./Storebroker")

class ContenedorProfesor {

    profesores;

    constructor(profesores) {
        if (typeof profesores === 'undefined') {
            console.log("Parametro de constructor indefinido")
        } else {
            this.profesores = profesores
        }
    }

    static async build() {

        try {
            let async_result = await Storebroker.getProfesores()
            async_result = async_result.map(p => {
                return new Profesor(
                    p.ID_USUARIO,
                    p.email,
                    p.credencial,
                    p.nombre,
                    p.apellido,
                    p.telefono,
                    p.direccion,
                    p.horaInicio,
                    p.horaFin
                )
            })
            return new ContenedorProfesor(async_result)
        } catch (err) {
            throw err
        }

    }

    getProfesores() {
        return this.profesores
    }

    crearProfesor(email, nombre, apellido, telefono, direccion, horaInicio, horaFin) {
        // era guardar profesor, cambie de nombre

        let p_nuevo = new Profesor(
            9999,
            email,
            0,
            nombre,
            apellido,
            telefono,
            direccion,
            horaInicio,
            horaFin
        )
        Storebroker.crearProfesor(p_nuevo).then(r => {
            p_nuevo.id_usuario = r
            this.profesores.push(p_nuevo)
        })


    }

    editarProfesor(profesor) {
        Storebroker.editarProfesor(profesor)
        this.profesores = this.profesores.map(p => {
                if (p.id_usuario === profesor.id_usuario) {
                    return profesor
                } else {
                    return p
                }
            }
        );

    }

    eliminarProfesor(profesor) {

        Storebroker.eliminarProfesor(profesor)
        this.profesores = this.profesores.filter(p => p.id_usuario !== profesor.id_usuario)

    }


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

module.exports = {Profesor, ContenedorProfesor}
