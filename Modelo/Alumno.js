
class ContenedorAlumnos {
    alumnos;

    constructor() {
        this.alumnos = []
    }

    getAlumnos() {
        return this.alumnos
    }

    crearAlumno(nombre, apellido, telefono, direccion, cantClasesRestantes, cantHorasClasesRestantes) {
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
    cantHorasClasesRestantes;

    constructor(id_alumno, nombre, apellido, telefono, direccion, cantClasesRestantes, cantHorasClasesRestantes) {
        this.id_alumno = id_alumno;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.direccion = direccion;
        this.cantClasesRestantes = cantClasesRestantes;
        this.cantHorasClasesRestantes = cantHorasClasesRestantes;
    }


    editarAlumno() {}

    asociarPaquete() {}

    usarClase(duracionClase) {
        this.cantClasesRestantes -= 1
        this.cantHorasClasesRestantes -= duracionClase
    }

    devolverClase(duracionClase) {
        this.cantClasesRestantes += 1
        this.cantHorasClasesRestantes += duracionClase
    }
}

