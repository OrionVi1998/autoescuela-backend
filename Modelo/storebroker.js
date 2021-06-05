const Profesor = require("./Profesor");

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

    static async eliminarProfesor() {
    }

    static async crearAlumnos() {
    }

    static async editarAlumnos() {
    }

    static async eliminarAlumnos() {
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

    static async crearTurnos() {
    }

    static async editarTurnos() {
    }

    static async eliminarTurnos() {
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

Storebroker.editarProfesor(p)


module.exports = Storebroker
