const Profesor = require("./Profesor");
const {Alumno} = require("./Alumno")
const Paquete = require("./Paquete")
const Pago = require("./Pago")
const Turno = require("./Turno")
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

    static async getAlumnos() {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("SELECT * FROM alumnos");
            console.log(rows); // FIXME

        } catch (err) {
            throw err;
        } finally {
            if (conn) return conn.end;
        }


    } //TODO

    static async crearAlumno(alumno) {
        let conn;
        try {
            conn = await pool.getConnection();
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
            conn = await pool.getConnection();
            const rows = await conn.query("UPDATE alumnos SET nombre=?, apellido=?, telefono=?, direccion=?, cantClasesRestantes=?, cantHorasClaseRestantes=? WHERE ID_ALUMNO=?",
                [alumno.nombre, alumno.apellido, alumno.telefono, alumno.direccion, alumno.cantClasesRestantes, alumno.cantHorasClaseRestantes, alumno.id_alumno]);
            console.log(rows); // FIXME

        } catch (err) {
            throw err;
        } finally {
            if (conn) return conn.end;
        }
    }

    static async eliminarAlumno(alumno) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("DELETE FROM alumnos WHERE ID_ALUMNO=?",
                [alumno.id_alumno]);
            console.log(rows); // FIXME

        } catch (err) {
            throw err;
        } finally {
            if (conn) return conn.end;
        }
    }

    static async getPaquetes() {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("SELECT * FROM paquetes");
            console.log(rows); // FIXME

        } catch (err) {
            throw err;
        } finally {
            if (conn) return conn.end;
        }
    }

    static async crearPaquete(paquete) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("INSERT INTO paquetes (nombre, cantClases, duracionClases, precio, estado) VALUES (?, ?, ?, ?, 1)",
                [paquete.nombre, paquete.cantClases, paquete.duracionClase, paquete.precio]);
            console.log(rows); // FIXME

        } catch (err) {
            throw err;
        } finally {
            if (conn) return conn.end;
        }
    }

    static async editarPaquete(paquete) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("UPDATE paquetes SET nombre=?, cantClases=?, duracionClases=?, precio=?, estado=? WHERE ID_PAQUETE=?",
                [paquete.nombre, paquete.cantClases, paquete.duracionClase, paquete.precio, paquete.estado, paquete.id_paquete]);
            console.log(rows); // FIXME

        } catch (err) {
            throw err;
        } finally {
            if (conn) return conn.end;
        }
    }

    static async eliminarPaquete(paquete) {
        let conn;
        try {
            conn = await pool.getConnection(); // 0 invisible wow 1 = visibles O-O
            const rows = await conn.query("UPDATE paquetes SET estado=0 WHERE ID_PAQUETE=?",
                [paquete.id_paquete]);
            console.log(rows); // FIXME

        } catch (err) {
            throw err;
        } finally {
            if (conn) return conn.end;
        }
    }

    static async getPagos() {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("SELECT * FROM pagos");
            console.log(rows); // FIXME

        } catch (err) {
            throw err;
        } finally {
            if (conn) return conn.end;
        }
    }

    static async crearPago(pago) {
        let conn;
        try {
            conn = await pool.getConnection(); // pagado = 1 // a pagar = 0
            const rows = await conn.query("INSERT INTO pagos (ALUMNO_ID, PAQUETE_ID, monto, fechaRealizado, pagado) VALUES (?, ?, ?, ?, ?)",
                [pago.alumno_id, pago.paquete_id, pago.monto, pago.fechaRealizada, pago.pagado]);
            console.log(rows); // FIXME

        } catch (err) {
            throw err;
        } finally {
            if (conn) return conn.end;
        }
    }

    static async editarPago(pago) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("UPDATE pagos SET ALUMNO_ID=?, PAQUETE_ID=?, monto=?, fechaRealizado=?, pagado=? WHERE ID_PAGO=?",
                [pago.alumno_id, pago.paquete_id, pago.monto, pago.fechaRealizada, pago.pagado, pago.id_pago]);
            console.log(rows); // FIXME

        } catch (err) {
            throw err;
        } finally {
            if (conn) return conn.end;
        }
    }

    static async eliminarPago(pago) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("DELETE FROM pagos WHERE ID_PAGO=?",
                [pago.id_pago]);
            console.log(rows); // FIXME

        } catch (err) {
            throw err;
        } finally {
            if (conn) return conn.end;
        }
    }

    static async crearTurno(turno) {
        let conn;
        try {
            conn = await pool.getConnection(); // pagado = 1 // a pagar = 0
            const rows = await conn.query("INSERT INTO turnos (ALUMNO_ID, USUARIO_ID, horaInicio, horaFin) VALUES (?, ?, ?, ?)",
                [turno.alumno_id, turno.usuario_id, turno.horaInicio, turno.horaFin]);
            console.log(rows); // FIXME

        } catch (err) {
            throw err;
        } finally {
            if (conn) return conn.end;
        }
    }

    static async editarTurno(turno) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("UPDATE turnos SET ALUMNO_ID=?, USUARIO_ID=?, horaInicio=?, horaFin=? WHERE ID_TURNO=?",
                [turno.alumno_id, turno.usuario_id, turno.horaInicio, turno.horaFin, turno.id_turno]);
            console.log(rows); // FIXME

        } catch (err) {
            throw err;
        } finally {
            if (conn) return conn.end;
        }
    }

    static async eliminarTurno(turno) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("DELETE FROM turnos WHERE ID_TURNO=?",
                [turno.id_turno]);
            console.log(rows); // FIXME

        } catch (err) {
            throw err;
        } finally {
            if (conn) return conn.end;
        }
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
    2,
    "alfy",
    "Laguirre",
    911,
    "Sotano de la torre",
    1,
    2,
)


let pack = new Paquete(
    1,
    "Paquete primero",
    3,
    1,
    666,
    1
)


// Storebroker.getPaquete()
// Storebroker.crearPaquete(pack)
// Storebroker.editarPaquete(pack)
// Storebroker.eliminarPaquete(pack)


let pag = new Pago(
    1,
    2,
    1,
    432,
    "2021-10-24",
    0
)

// Storebroker.getPagos()
// Storebroker.crearPago(pag)
// Storebroker.editarPago(pag)
//Storebroker.eliminarPago(pag)

let t = new Turno(
    2,
    "10:00:00",
    "23:00:00",
    4,
    2
)

// Storebroker.crearTurno(t)
// Storebroker.editarTurno(t)
// Storebroker.eliminarTurno(t)

// Storebroker.getPagos()

// Storebroker.eliminarAlumno(a)

// Storebroker.crearProfesor(p)
// Storebroker.editarProfesor(p)
//Storebroker.eliminarProfesor(p)

module.exports = Storebroker
