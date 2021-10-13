const Storebroker = require('./storebroker');

class ContenedorPagos {

    pagos;

    constructor(pagos) {

        if (typeof pagos === "undefined") {
            console.log("ERROR: Parametro del constructor NO definido\n");
        } else {

            this.pagos = pagos;
        }
    }

    static async build() {
        try {
            let async_result = await Storebroker.getPagos()
            async_result = async_result.map(pago => {
                return new Pago(
                    pago.ID_PAGO,
                    pago.ALUMNO_ID,
                    pago.PAQUETE_ID,
                    pago.monto,
                    pago.fechaRealizado,
                    pago.pagado
                )
            })
            return new ContenedorPagos(async_result)
        } catch (err) {
            throw err
        }
    }

    getPagos() {
        return this.pagos;
    }

    getPago(pago) {
        return this.pagos.find(p => pago.id_pago === p.id_pago)
    }

    getPagosAlumno(alumno) {
        return this.pagos.filter(p => p.alumno_id === alumno.id_alumno);
    }

    crearPago(alumno_id, paquete_id, monto, fechaRealizada, pagado) {

        let pago = new Pago(
            1000,
            alumno_id,
            paquete_id,
            monto,
            fechaRealizada,
            pagado
        );

        Storebroker.crearPago(pago).then(r => {
            pago.id_pago = r
            this.pagos.push(pago)
            // console.log(this.pagos)
        });
    }

    generarPagos(paquete, alumno) {

        let fechaSenia = new Date()
        // fechaSenia.setUTCMonth(fechaSenia.getUTCMonth()-1)
        fechaSenia.setUTCHours(fechaSenia.getUTCHours()-3)


        if (paquete.cantClases > 1) {
            let monto_inicial = Math.round(paquete.precio*0.1)
            let primerPago = Math.round((paquete.precio - monto_inicial)/ 2)
            this.crearPago(alumno.id_alumno, paquete.id_paquete, monto_inicial, fechaSenia, 1)
            this.crearPago(alumno.id_alumno, paquete.id_paquete, primerPago, null, 0)
            this.crearPago(alumno.id_alumno, paquete.id_paquete, paquete.precio-monto_inicial-primerPago, null, 0)

        } else {
            this.crearPago(alumno.id_alumno, paquete.id_paquete, paquete.precio, fechaSenia, 1)
        }
    }

    getPrimerPago(alumno, paquete) {

        let monto_inicial = Math.round(paquete.precio*0.1)
        let pagoInicial = this.pagos.filter(p => (p.alumno_id === alumno.id_alumno) && (p.monto === monto_inicial) && (p.paquete_id === paquete.id_paquete))

        return pagoInicial

    }


    editarPago(pago) {
        Storebroker.editarPago(pago);
        this.pagos = this.pagos.map(r => {
            if (r.id_pago === pago.id_pago) {
                return pago;
            } else {
                return r;
            }
        });
    }

    eliminarPago(pago) {
        Storebroker.eliminarPago(pago);
        this.pagos = this.pagos.filter(p => p.id_pago !== pago.id_pago)
    }

    getPagosPendientes() {
        return this.pagos.filter(p => p.pagado === 0)
    }

    enDeudado(alumno) {
        return this.pagos.filter(p => p.pagado === 0 && p.alumno_id === alumno.id_alumno).length !== 0
    }
}


class Pago {

    id_pago;
    alumno_id;
    paquete_id;
    monto;
    fechaRealizada;
    pagado;

    constructor(id_pago, alumno_id, paquete_id, monto, fechaRealizada = null, pagado = false) {
        this.id_pago = id_pago
        this.alumno_id = alumno_id
        this.paquete_id = paquete_id
        this.monto = monto
        this.fechaRealizada = fechaRealizada
        this.pagado = pagado
    }

    registrarPago() {
        this.pagado = 1;
        this.fechaRealizada = new Date()
        Storebroker.editarPago(this)
    }

}

// let pago = new Pago(5, 2, 3, 300, "2021-12-25", 0);

// ContenedorPagos.build().then(cp => {
//     console.log(cp)
//     //cp.generarPago(pago.alumno_id, pago.paquete_id, pago.monto, pago.fechaRealizada, pago.pagado);
//     //cp.getPagos();
//     //cp.modificarPago(pago);
//     //cp.eliminarPago(pago);
//     //cp.getPagosPendientes();
//
// });

module.exports = {Pago, ContenedorPagos}
