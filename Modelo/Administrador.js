const Usuario = require("./Usuario")
const Storebroker = require("./storebroker")

class ContenedorAdministrador {

    administradores;

    constructor(administradores) {
        if (typeof administradores === 'undefined') {
            console.log("Parametro de constructor indefinido")
        } else {
            this.administradores = administradores
        }
    }

    static async build() {

        try {
            let async_result = await Storebroker.getAdministradores()
            async_result = async_result.map(p => {
                return new Administrador(
                    p.ID_USUARIO,
                    p.email,
                    p.credencial
                )
            })
            return new ContenedorAdministrador(async_result)
        } catch (err) {
            throw err
        }
    }

    getAdministradores() {
        return this.administradores
    }


}


class Administrador extends Usuario {

    constructor(id_usuario, email, credencial) {
        super(id_usuario, email, credencial);
    }

}

module.exports = {Administrador, ContenedorAdministrador}
