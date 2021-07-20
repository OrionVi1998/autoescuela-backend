const Usuario = require("./Usuario")
const Storebroker = require("./storebroker")

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

    getProfesor(profesor) {
        return this.profesores.find(p => p.id_usuario === profesor.id_usuario)
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

        Storebroker.crearProfesor(p_nuevo).then(id_retornada => {
            p_nuevo.id_usuario = id_retornada
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
    }


    // Retorna True si puede tener turno en esta hora
    verificarDispHoraria(turnoFechaInicio, duracionClase) {

        // la hora del profesor esta en formato time HH:mm:ss
        let horaInicio = this.horaInicio.split(":")
        let horaFin = this.horaFin.split(":")

        // convertimos las fechas en mainAPI

        // el -3 es para pasar el horario a GMT-3 (Argentina Standard Time)
        let profHoraInicio = new Date(turnoFechaInicio.getFullYear(),
                                      turnoFechaInicio.getMonth(),
                                      turnoFechaInicio.getDate(),
                                      Number(horaInicio[0])-3,
                                      Number(horaInicio[1]),
                                      0)

        // el -3 es para pasar el horario a GMT-3 (Argentina Standard Time)
        let profHoraFin = new Date(turnoFechaInicio.getFullYear(),
                                   turnoFechaInicio.getMonth(),
                                   turnoFechaInicio.getDate(),
                                   Number(horaFin[0])-3,
                                   Number(horaFin[1]),
                                   0)


        if (profHoraInicio.getTime() < turnoFechaInicio.getTime() &&
            (turnoFechaInicio.getTime() + (duracionClase * 60)) < profHoraFin.getTime()) {

            // console.log(profHoraInicio.getTime() < turnoFechaInicio.getTime() && (turnoFechaInicio.getTime() + duracionClase) < profHoraFin.getTime())

            // aca solo chequeamos si tiene disponibilidad horaria
            // el trabajo de chequear si tiene turnos en este horario seria de turnos
            return true;

        } else {
            return false
        }
    }

}


// ContenedorProfesor.build().then(cp => {
//     let p = new Profesor(
//         1,1,1,1,1,1,11,"10:00:00","15:10:00"
//     )
//     p.verificarDispHoraria("11:00:00", 5*60+11)
// })

module.exports = {Profesor, ContenedorProfesor}
