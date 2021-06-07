const Storebroker = require('./storebroker')


class ContenedorPaquete {
    paquetes;

    constructor(paquetes) {
        // TODO: agregar constructor para un objeto desde la BD
        if (typeof paquetes === 'undefined') {
            console.log("Parametro de constructor indefinido")
        } else {
            this.paquetes = paquetes
        }
    }


    static async build() {
        try {
            let async_result = await Storebroker.getPaquetes()
            async_result = async_result.map(p => {
                return new Paquete(
                    p.ID_PAQUETE,
                    p.nombre,
                    p.cantClases,
                    p.duracionClases,
                    p.precio,
                    p.estado
                )
            })
            return new ContenedorPaquete(async_result)
        } catch (err) {
            throw err
        }
    }

    getPaquetes() {
        return this.paquetes
    }

    crearPaquete(nombre, cantClases, duracionClases, precio, estado) {

        let paq = new Paquete(
            9999,
            nombre,
            cantClases,
            duracionClases,
            precio,
            estado
        );

        Storebroker.crearPaquete(paq).then(r => {
            paq.id_paquete = r
            this.paquetes.push(paq)
            console.log(this.paquetes)
        })

    }

    editarPaquete(paquete) {

        Storebroker.editarPaquete(paquete)

        this.paquetes = this.paquetes.map(p => {
                if (p.id_paquete === paquete.id_paquete) {
                    return paquete
                } else {
                    return p
                }
            }
        );
    }

    eliminarPaquete(paquete) {

        Storebroker.eliminarPaquete(paquete)
        this.paquetes = this.paquetes.map(p => {
                if (p.id_paquete === paquete.id_paquete) {
                    return paquete
                } else {
                    return p
                }
            }
        );
    }


}

class Paquete {

    id_paquete;
    nombre;
    cantClases;
    duracionClases;
    precio;
    estado;

    constructor(id_paquete, nombre, cantClases, duracionClase, precio, estado = 1) {
        this.id_paquete = id_paquete
        this.nombre = nombre
        this.cantClases = cantClases
        this.duracionClases = duracionClase
        this.precio = precio
        this.estado = estado
    }

}


ContenedorPaquete.build().then(cp => {
    console.log(cp)
    cp.crearPaquete("Quinto Paquete", 3, 1, 2700, 1)
})


module.exports = {Paquete, ContenedorPaquete}
