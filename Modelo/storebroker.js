
const config = require("./config.json");
const mariadb = require("mariadb");
const pool = mariadb.createPool(config);

class Storebroker {

    static async getProfesores() {
        let conn;
        try {
            conn = await pool.getConnection(); // 1 = administrador & 0 = profesores
            const rows = await conn.query("SELECT * FROM usuarios WHERE usuarios.credencial = 0;");

            // console.log(rows)
            return rows.slice(0, rows.length)

        } catch (err) {
            throw err;
        } finally {
            if (conn) await conn.end;
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

            let last_id = await conn.query("SELECT LAST_INSERT_ID()");
            // console.log(last_id)
            return last_id[0]["LAST_INSERT_ID()"];

        } catch (err) {
            throw err;
        } finally {
            if (conn) await conn.end;
        }
    }

    static async editarProfesor(profesor) {
        let conn;
        try {
            conn = await pool.getConnection(); // 1 = administrador & 0 = profesores
            // columnas: (email, credencial, nombre, apellido, telefono, direccion, horaInicio, horaFin)
            const rows = await conn.query("UPDATE usuarios SET email=?, credencial=?, nombre=?, apellido=?, telefono=?, direccion=?, horaInicio=?, horaFin=? WHERE ID_USUARIO=?",
                [profesor.email, 0, profesor.nombre, profesor.apellido, profesor.telefono, profesor.direccion, profesor.horaInicio, profesor.horaFin, profesor.id_usuario]);
            console.log(rows); // TODO


        } catch (err) {
            throw err;
        } finally {
            if (conn) await conn.end;
        }
    }

    static async eliminarProfesor(profesor) {
        let conn;
        try {
            conn = await pool.getConnection(); // 1 = administrador & 0 = profesores
            const rows = await conn.query("DELETE FROM usuarios WHERE (ID_USUARIO=? AND credencial=0)",
                [profesor.id_usuario]);
            console.log(rows); // TODO

        } catch (err) {
            throw err;
        } finally {
            if (conn) await conn.end;
        }
    }

    static async getAlumnos() {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("SELECT * FROM alumnos");
            return rows.slice(0, rows.length)

        } catch (err) {
            throw err;
        } finally {
            if (conn) await conn.end;
        }


    }

    static async crearAlumno(alumno) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("INSERT INTO alumnos (nombre, apellido, telefono, direccion, cantClasesRestantes, cantHorasClaseRestantes) VALUES (?, ?, ?, ?, ?, ?)",
                [alumno.nombre, alumno.apellido, alumno.telefono, alumno.direccion, alumno.cantClasesRestantes, alumno.cantHorasClaseRestantes]);
            console.log(rows); // TODO
            let last_id = await conn.query("SELECT LAST_INSERT_ID()");
            // console.log(last_id)
            return last_id[0]["LAST_INSERT_ID()"];

        } catch (err) {
            throw err;
        } finally {
            if (conn) await conn.end;
        }
    }

    static async editarAlumno(alumno) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("UPDATE alumnos SET nombre=?, apellido=?, telefono=?, direccion=?, cantClasesRestantes=?, cantHorasClaseRestantes=? WHERE ID_ALUMNO=?",
                [alumno.nombre, alumno.apellido, alumno.telefono, alumno.direccion, alumno.cantClasesRestantes, alumno.cantHorasClaseRestantes, alumno.id_alumno]);
            console.log(rows); // TODO

        } catch (err) {
            throw err;
        } finally {
            if (conn) await conn.end;
        }
    }

    static async eliminarAlumno(alumno) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("DELETE FROM alumnos WHERE ID_ALUMNO=?",
                [alumno.id_alumno]);
            console.log(rows); // TODO

        } catch (err) {
            throw err;
        } finally {
            if (conn) await conn.end;
        }
    }

    static async getPaquetes() {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("SELECT * FROM paquetes");

            let paquetes_retorno = rows.slice(0,rows.length) // sacamos las rows de META

            return paquetes_retorno

        } catch (err) {
            throw err;
        } finally {
            if (conn) await conn.end;
        }
    }

    static async crearPaquete(paquete) {
        let conn;
        try {
            conn = await pool.getConnection();
            // usar esto en PostgreSQL INSERT INTO persons (lastname,firstname) VALUES ('Smith', 'John') RETURNING id;
            const rows = await conn.query("INSERT INTO paquetes (nombre, cantClases, duracionClases, precio, estado) VALUES (?, ?, ?, ?, 1)",
                [paquete.nombre, paquete.cantClases, paquete.duracionClases, paquete.precio]);
            // console.log(rows);

            let last_id = await conn.query("SELECT LAST_INSERT_ID()");
            // console.log(last_id)
            return last_id[0]["LAST_INSERT_ID()"];

        } catch (err) {
            throw err;
        } finally {
            if (conn) await conn.end;
        }
    }

    static async editarPaquete(paquete) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("UPDATE paquetes SET nombre=?, cantClases=?, duracionClases=?, precio=?, estado=? WHERE ID_PAQUETE=?",
                [paquete.nombre, paquete.cantClases, paquete.duracionClase, paquete.precio, paquete.estado, paquete.id_paquete]);
            console.log(rows); // TODO

        } catch (err) {
            throw err;
        } finally {
            if (conn) await conn.end;
        }
    }

    static async eliminarPaquete(paquete) {
        let conn;
        try {
            conn = await pool.getConnection(); // 0 invisible wow 1 = visibles O-O
            const rows = await conn.query("UPDATE paquetes SET estado=0 WHERE ID_PAQUETE=?",
                [paquete.id_paquete]);
            console.log(rows); // TODO

        } catch (err) {
            throw err;
        } finally {
            if (conn) await conn.end;
        }
    }

    static async getPagos() {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("SELECT * FROM pagos");
            console.log(rows); // TODO

        } catch (err) {
            throw err;
        } finally {
            if (conn) await conn.end;
        }
    }

    static async crearPago(pago) {
        let conn;
        try {
            conn = await pool.getConnection(); // pagado = 1 // a pagar = 0
            const rows = await conn.query("INSERT INTO pagos (ALUMNO_ID, PAQUETE_ID, monto, fechaRealizado, pagado) VALUES (?, ?, ?, ?, ?)",
                [pago.alumno_id, pago.paquete_id, pago.monto, pago.fechaRealizada, pago.pagado]);
            console.log(rows); // TODO

        } catch (err) {
            throw err;
        } finally {
            if (conn) await conn.end;
        }
    }

    static async editarPago(pago) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("UPDATE pagos SET ALUMNO_ID=?, PAQUETE_ID=?, monto=?, fechaRealizado=?, pagado=? WHERE ID_PAGO=?",
                [pago.alumno_id, pago.paquete_id, pago.monto, pago.fechaRealizada, pago.pagado, pago.id_pago]);
            console.log(rows); // TODO

        } catch (err) {
            throw err;
        } finally {
            if (conn) await conn.end;
        }
    }

    static async eliminarPago(pago) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("DELETE FROM pagos WHERE ID_PAGO=?",
                [pago.id_pago]);
            console.log(rows); // TODO

        } catch (err) {
            throw err;
        } finally {
            if (conn) await conn.end;
        }
    }

    static async getTurnos() {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("SELECT * FROM turnos");

            let turnos_retorno = rows.slice(0,rows.length) // sacamos las rows de META

            return turnos_retorno


        } catch (err) {
            throw err;
        } finally {
            if (conn) await conn.end;
        }
    }

    static async crearTurno(turno) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("INSERT INTO turnos (ALUMNO_ID, USUARIO_ID, fechaHoraInicio, fechaHoraFin) VALUES (?, ?, ?, ?)",
                [turno.alumno_id, turno.usuario_id, turno.fechaHoraInicio, turno.fechaHoraFin]);

            let last_id = await conn.query("SELECT LAST_INSERT_ID()");
            // console.log(last_id)
            return last_id[0]["LAST_INSERT_ID()"];


        } catch (err) {
            throw err;
        } finally {
            if (conn) await conn.end;
        }
    }

    static async editarTurno(turno) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("UPDATE turnos SET ALUMNO_ID=?, USUARIO_ID=?, fechaHoraInicio=?, fechaHoraFin=? WHERE ID_TURNO=?",
                [turno.alumno_id, turno.usuario_id, turno.fechaHoraInicio, turno.fechaHoraFin, turno.id_turno]);
            console.log(rows); // TODO

        } catch (err) {
            throw err;
        } finally {
            if (conn) await conn.end;
        }
    }

    static async eliminarTurno(turno) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("DELETE FROM turnos WHERE ID_TURNO=?",
                [turno.id_turno]);
            console.log(rows); // TODO

        } catch (err) {
            throw err;
        } finally {
            if (conn) await conn.end;
        }
    }
}

module.exports = Storebroker
