const Storebroker = require("./storebroker")


class ContenedorAlumno {
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
                    a.cantMinutosClaseRestantes
                )
            })
            return new ContenedorAlumno(async_result)
        } catch (err) {
            throw err
        }
    }

    getAlumnos() {
        return this.alumnos
    }

    crearAlumno(nombre, apellido, telefono, direccion) {
        //Cuando se crea el alumno la cantidad de clases es
        let alumno_nuevo = new Alumno(
            9999,
            nombre,
            apellido,
            telefono,
            direccion,
            0,
            0
        )
        Storebroker.crearAlumno(alumno_nuevo).then(id => {
            alumno_nuevo.id_alumno = id
            this.alumnos.push(alumno_nuevo)
            // console.log(this.alumnos)
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
        this.alumnos = this.alumnos.filter(a => alumno.id_alumno !== a.id_alumno)
    }

    getAlumno(alumno) {
        return this.alumnos.find(a => a.id_alumno === alumno.id_alumno)
    }


}

class Alumno {
    id_alumno;
    nombre;
    apellido;
    telefono;
    direccion;
    cantClasesRestantes;
    cantMinutosClaseRestantes;

    constructor(id_alumno, nombre, apellido, telefono, direccion, cantClasesRestantes, cantMinutosClaseRestantes) {
        this.id_alumno = id_alumno;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.direccion = direccion;
        this.cantClasesRestantes = cantClasesRestantes;
        this.cantMinutosClaseRestantes = cantMinutosClaseRestantes;
    }

    asociarPaquete(paquete) {
        // Mediador?
    }

    usarClase(duracionClase) {
        this.cantClasesRestantes -= 1
        this.cantMinutosClaseRestantes -= duracionClase
        Storebroker.editarAlumno(this)
    }

    devolverClase(duracionClase) {
        this.cantClasesRestantes += 1
        this.cantMinutosClaseRestantes += duracionClase
        Storebroker.editarAlumno(this)
    }
}


// let duracionClase = this.cantClasesRestantes / this.cantMinutosClaseRestantes


module.exports = {Alumno, ContenedorAlumno}

