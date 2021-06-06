
class ContenedorAlumnos {
    alumnos;

    constructor() {
        this.alumnos = []
    }

    getAlumnos() {
        return this.alumnos
    }

    crearAlumno(nombre, apellido, telefono, direccion, cantClasesRestantes, cantHorasClaseRestantes) {
        let alumno_nuevo = new Alumno(

        )
    }

    eliminarAlumno() {}

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


    editarAlumno() {}

    asociarPaquete() {}

    usarClase(duracionClase) {
        this.cantClasesRestantes -= 1
        this.cantHorasClaseRestantes -= duracionClase
    }

    devolverClase(duracionClase) {
        this.cantClasesRestantes += 1
        this.cantHorasClaseRestantes += duracionClase
    }
}

module.exports = {Alumno, ContenedorAlumnos}

