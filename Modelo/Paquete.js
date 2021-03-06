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


    async crearPaquete(nombre, cantClases, durClases, precio) {

        return new Promise((resolve, reject) => {
            try {
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
                    resolve(this.paquetes)
                })
            } catch (e) {
                console.log(e)
                reject(e)
            }

        })

    }

    editarPaquete(paquete) {

        let oldPaquete = this.paquetes.find(p => paquete.id_paquete === p.id_paquete)
        Object.keys(oldPaquete).map(k => {
            if (typeof paquete[k] === 'undefined') {
                paquete[k] = oldPaquete[k]
            } else {
                paquete[k] = paquete[k]
            }
        })

        Storebroker.editarPaquete(paquete)
        this.paquetes = this.paquetes.map(p => {
                if (p.id_paquete === paquete.id_paquete) {
                    return new Paquete(
                        paquete.id_paquete,
                        paquete.nombre,
                        paquete.cantClases,
                        paquete.durClases,
                        paquete.precio,
                        paquete.estado
                    )
                } else {
                    return p
                }
            }
        );
        return this.paquetes;
    }

    eliminarPaquete(paquete) {
        Storebroker.eliminarPaquete(paquete);
        paquete.estado = 0;
        this.paquetes = this.paquetes.map(p => {
                if (p.id_paquete === paquete.id_paquete) {
                    return paquete
                } else {
                    return p
                }
            }
        );
        return this.paquetes
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


