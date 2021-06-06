const Profesor = require("./Profesor");
const {Alumno} = require("./Alumno")
const config = require("./config.json");
const mariadb = require("mariadb")
const pool = mariadb.createPool()


class Storebroker {

    static async getProfesores() {
        let conn;
        try {
            conn = await pool.getConnection(); // 1 = administrador & 0 = profesores
            const rows = await conn.query("SELECT * FROM usuarios WHERE usuarios.credencial = 0;");
            console.log(rows); // FIXME

        } catch (err) {
            throw err;
        } finally {
            if (conn) return conn.end;
        }
    }


    static async crearProfesor(profesor) {
        let conn;
        try {
            conn = await pool.getConnection(); // 1 = administrador & 0 = profesores
            // columnas: (email, credencial, nombre, apellido, telefono, direccion, horaInicio, horaFin)
            const rows = await conn.query(
                `INSERT INTO usuarios (email, credencial, nombre, apellido, telefono, direccion, horaInicio, horaFin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [profesor.email, 0, profesor.nombre, profesor.apellido, profesor.telefono, profesor.direccion, profesor.horaInicio, profesor.horaFin]);
            console.log(rows); // FIXME

        } catch (err) {
            throw err;
        } finally {
            if (conn) return conn.end;
        }
    }


    static async editarProfesor(profesor) {

        let conn;
        try {
            conn = await pool.getConnection(); // 1 = administrador & 0 = profesores
            // columnas: (email, credencial, nombre, apellido, telefono, direccion, horaInicio, horaFin)
            const rows = await conn.query("UPDATE usuarios SET email=?, credencial=?, nombre=?, apellido=?, telefono=?, direccion=?, horaInicio=?, horaFin=? WHERE ID_USUARIO=?",
                [profesor.email, 0, profesor.nombre, profesor.apellido, profesor.telefono, profesor.direccion, profesor.horaInicio, profesor.horaFin, profesor.id_usuario]);
            console.log(rows); // FIXME


        } catch (err) {
            throw err;
        } finally {
            if (conn) return conn.end;
        }

    }

    static async eliminarProfesor(profesor) {
        let conn;
        try {
            conn = await pool.getConnection(); // 1 = administrador & 0 = profesores
            const rows = await conn.query("DELETE FROM usuarios WHERE (ID_USUARIO=? AND credencial=0)",
                [profesor.id_usuario]);
            console.log(rows); // FIXME

        } catch (err) {
            throw err;
        } finally {
            if (conn) return conn.end;
        }
    }

    static async crearAlumno(alumno) {
        let conn;
        try {
            conn = await pool.getConnection(); // 1 = administrador & 0 = profesores
            const rows = await conn.query("INSERT INTO alumnos (nombre, apellido, telefono, direccion, cantClasesRestantes, cantHorasClaseRestantes) VALUES (?, ?, ?, ?, ?, ?)",
                [alumno.nombre, alumno.apellido, alumno.telefono, alumno.direccion, alumno.cantClasesRestantes, alumno.cantHorasClaseRestantes]);
            console.log(rows); // FIXME

        } catch (err) {
            throw err;
        } finally {
            if (conn) return conn.end;
        }
    }

    static async editarAlumno(alumno) {

        let conn;
        try {
            conn = await pool.getConnection(); // 1 = administrador & 0 = profesores
            const rows = await conn.query("INSERT INTO alumnos (nombre, apellido, telefono, direccion, cantClasesRestantes, cantHorasClaseRestantes) VALUES (?, ?, ?, ?, ?, ?)",
                [alumno.nombre, alumno.apellido, alumno.telefono, alumno.direccion, alumno.cantClasesRestantes, alumno.cantHorasClaseRestantes]);
            console.log(rows); // FIXME

        } catch (err) {
            throw err;
        } finally {
            if (conn) return conn.end;
        }

    }

    static async eliminarAlumno() {
    }

    static async crearPaquete() {
    }

    static async editarPaquete() {
    }

    static async eliminarPaquete() {
    }

    static async crearPago() {
    }

    static async editarPago() {
    }

    static async eliminarPago() {
    }

    static async crearTurno() {
    }

    static async editarTurno() {
    }

    static async eliminarTurno() {
    }
}

// Storebroker.getProfesores()

let p = new Profesor(
    3,
    "presidenta@somalia.haha",
    0,
    "Langosta",
    "Luna",
    666666666,
    "Somalia 321",
    "08:00:00",
    "20:10:30"
)

let a = new Alumno(
    1,
    "alfy",
    "Bartolome",
    911,
    "Atico de la torre",
    1,
    2,
)


// Storebroker.crearAlumno(a)

// Storebroker.crearProfesor(p)
// Storebroker.editarProfesor(p)
//Storebroker.eliminarProfesor(p)

module.exports = Storebroker
