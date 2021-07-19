const Storebroker = require('./storebroker')

class ContenedorPaquete {
    paquetes;

    constructor(paquetes) {
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
                    p.durClases,
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

    getPaquete(id) {
        return this.paquetes.find(p => p.id_paquete === id)
    }

    getPaquetesVisibles() {
        return this.paquetes.filter(p => p.estado === 1)
    }


    crearPaquete(nombre, cantClases, durClases, precio) {

        let paq = new Paquete(
            9999,
            nombre,
            cantClases,
            durClases,
            precio,
            1
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
    durClases;
    precio;
    estado;

    constructor(id_paquete, nombre, cantClases, durClase, precio, estado = 1) {
        this.id_paquete = id_paquete
        this.nombre = nombre
        this.cantClases = cantClases
        this.durClases = durClase
        this.precio = precio
        this.estado = estado
    }

}




module.exports = {Paquete, ContenedorPaquete}
