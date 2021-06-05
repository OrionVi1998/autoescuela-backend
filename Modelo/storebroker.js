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

}

// Storebroker.getProfesores()

let p = new Profesor(
    3,
    "presidenta@somalia.haha",
    0,
    "Somalia",
    "Luna",
    666666666,
    "Somalia 321",
    "08:00:00",
    "20:10:30"
)

Storebroker.editarProfesor(p)


module.exports = Storebroker
