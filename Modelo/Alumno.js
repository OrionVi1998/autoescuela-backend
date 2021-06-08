const Storebroker = require("./storebroker")


class ContenedorAlumnos {
    alumnos;

    constructor(alumnos) {
        if (typeof alumnos === 'undefined') {
            console.log("Parametro de constructor indefinido")
        } else {
            this.alumnos = alumnos
        }
    }

    static async build() {
        try {
            let async_result = await Storebroker.getAlumnos()
            async_result = async_result.map(a => {
                return new Alumno(
                    a.ID_ALUMNO,
                    a.nombre,
                    a.apellido,
                    a.telefono,
                    a.direccion,
                    a.cantClasesRestantes,
                    a.cantHorasClaseRestantes
                )
            })
            return new ContenedorAlumnos(async_result)
        } catch (err) {
            throw err
        }
    }

    getAlumnos() {
        return this.alumnos
    }

    crearAlumno(nombre, apellido, telefono, direccion, cantClasesRestantes, cantHorasClaseRestantes) {
        let alumno_nuevo = new Alumno(
            9999,
            nombre,
            apellido,
            telefono,
            direccion,
            cantClasesRestantes,
            cantHorasClaseRestantes
        )
        Storebroker.crearAlumno(alumno_nuevo).then(id => {
            alumno_nuevo.id_alumno = id
            this.alumnos.push(alumno_nuevo)
            console.log(this.alumnos)
        })


    }

    editarAlumno(alumno) {
        Storebroker.editarAlumno(alumno)
        this.alumnos = this.alumnos.map(a => {
                if (a.id_alumno === alumno.id_alumno) {
                    return alumno
                } else {
                    return a
                }
            }
        );
    }

    eliminarAlumno(alumno) {
        // TODO: Ver si la logica de eliminacion estaria aca o no
        // UN ALUMNO NO SE PUEDE ELIMINAR SI ...
        Storebroker.eliminarAlumno(alumno)
        this.alumnos = this.alumnos.filter(a => a.id_alumno !== a.id_alumno)
    }

    getAlumno(id_alumno) {
        return this.alumnos.find(a => a.id_alumno === id_alumno)
    }


}

class Alumno {
    id_alumno;
    nombre;
    apellido;
    telefono;
    direccion;
    cantClasesRestantes;
    cantHorasClaseRestantes;

    constructor(id_alumno, nombre, apellido, telefono, direccion, cantClasesRestantes, cantHorasClaseRestantes) {
        this.id_alumno = id_alumno;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.direccion = direccion;
        this.cantClasesRestantes = cantClasesRestantes;
        this.cantHorasClaseRestantes = cantHorasClaseRestantes;
    }



    asociarPaquete(id_paquete) {



    }

    usarClase(duracionClase) {
        this.cantClasesRestantes -= 1
        this.cantHorasClaseRestantes -= duracionClase
    }

    devolverClase(duracionClase) {
        this.cantClasesRestantes += 1
        this.cantHorasClaseRestantes += duracionClase
    }
}

// ContenedorAlumnos.build().then((ca) => {
//     console.log(ca)
//     console.log(ca.getAlumno(2))
// })


module.exports = {Alumno, ContenedorAlumnos}

