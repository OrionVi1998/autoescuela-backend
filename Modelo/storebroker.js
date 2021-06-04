import {DataStore} from "@aws-amplify/datastore";
import {
    Pago,
    Paquete,
    Alumno,
    Turno,
    Usuario
} from "../models"


class storebroker {

    constructor() {
    }


    async obtener(modelo) {
        //Retorna una lista de la base de datos dependiendo el modelo pedido
        switch (modelo) {
            case "Pago":
                return await this.db.query(Pago)
            case "Alumno":
                return await this.db.query(Alumno)
            case "Paquete":
                return await this.db.query(Paquete)
            case "Turno":
                return await this.db.query(Turno)
            case "Usuario":
                return await this.db.query(Usuario)
            default:
                return null
        }
    }

    async obtener_uno(modelo, id) {
        //Retorna una lista de la base de datos dependiendo el modelo pedido
        switch (modelo) {
            case "Pago":
                return await this.db.query(Pago, id)
            case "Alumno":
                return await this.db.query(Alumno, id)
            case "Paquete":
                return await this.db.query(Paquete, id)
            case "Turno":
                return await this.db.query(Turno, id)
            case "Usuario":
                return await this.db.query(Usuario, id)
            default:
                return null
        }
    }

    async guardar_objeto(modelo, objeto_a_guardar) {

        // Toma un objeto y lo transforma para guardarlo en aws

        switch (modelo) {
            case "Pago":
                return await this.db.save(new Pago(objeto_a_guardar))
            case "Alumno":
                return await this.db.save(new Alumno(objeto_a_guardar))
            case "Paquete":
                return await this.db.save(new Paquete(objeto_a_guardar))
            case "Turno":
                return await this.db.save(new Turno(objeto_a_guardar))
            case "Usuario":
                return await this.db.save(new Usuario(objeto_a_guardar))
            default:
                return null
        }
    }

}

export default storebroker
