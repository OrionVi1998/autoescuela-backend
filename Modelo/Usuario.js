
class Usuario {
    id_usuario;
    email;
    credencial = 0; // inicializar con 0 por defecto

    constructor(id_usuario, email, credencial) {
        this.id_usuario = id_usuario
        this.email = email
        this.credencial = credencial
    }

    usuarioAutorizado() {
        if (this.credencial === 1) { // usuario administrador
            return true
        }
        if (this.credencial === 0) { // usuario normal
            return false
        }
    }
}

export default Usuario
