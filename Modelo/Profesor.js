const Usuario = require("./Usuario")
const Storebroker = require("./storebroker")
const moment = require("moment");

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

    async crearProfesor(email, nombre, apellido, telefono, direccion, horaInicio, horaFin) {
        // era guardar profesor, cambie de nombre

        return new Promise((resolve, reject) => {
            try {
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
                    resolve(this.profesores)
                })
            } catch (e) {
                console.log(e)
                reject(e)
            }
        })
    }

    editarProfesor(profesor) {

        let oldProfesor = this.profesores.find(p => profesor.id_usuario === p.id_usuario)
        Object.keys(oldProfesor).map(k => {
            if (typeof profesor[k] === 'undefined') {
                profesor[k] = oldProfesor[k]
            } else {
                profesor[k] = profesor[k]
            }
        })

        Storebroker.editarProfesor(profesor)
        this.profesores = this.profesores.map(p => {
                if (p.id_usuario === profesor.id_usuario) {
                    return new Profesor(
                        profesor.id_usuario,
                        profesor.email,
                        profesor.credencial,
                        profesor.nombre,
                        profesor.apellido,
                        profesor.telefono,
                        profesor.direccion,
                        profesor.horaInicio,
                        profesor.horaFin
                    )
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

        console.log(this.horaInicio, this.horaFin)
        // la hora del profesor esta en formato time HH:mm:ss
        let horaInicio = this.horaInicio.split(":")
        let horaFin = this.horaFin.split(":")


        // convertimos las fechas en mainAPI

        let profHoraInicio = moment.utc([turnoFechaInicio.getFullYear(),
            turnoFechaInicio.getMonth(),
            turnoFechaInicio.getDate(),
            Number(horaInicio[0]),
            Number(horaInicio[1]),
            0]).toDate()

        let profHoraFin = moment.utc([turnoFechaInicio.getFullYear(),
            turnoFechaInicio.getMonth(),
            turnoFechaInicio.getDate(),
            Number(horaFin[0]),
            Number(horaFin[1]),
            0]).toDate()

        console.log(moment(profHoraInicio).toDate(), moment(profHoraFin).toDate(), turnoFechaInicio)

        if (profHoraInicio <= turnoFechaInicio.getTime()) { //
            return profHoraFin >= (turnoFechaInicio.getTime() + (duracionClase * 60000))
        } else {
            return false
        }

        return (profHoraInicio.getTime() <= turnoFechaInicio.getTime() && (turnoFechaInicio.getTime() + (duracionClase * 60000)) <= profHoraFin.getTime());
    }

}


// ContenedorProfesor.build().then(cp => {
//     let p = new Profesor(
//         1,1,1,1,1,1,11,"10:00:00","15:10:00"
//     )
//     p.verificarDispHoraria("11:00:00", 5*60+11)
// })

module.exports = {Profesor, ContenedorProfesor}
