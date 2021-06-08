const Storebroker = require('./storebroker');

class ContenedorPagos {

    pagos;

    constructor(pagos) {

        if(typeof pagos === "undefined") {
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
                    pago.fechaRealizada,
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

    generarPago(alumno_id, paquete_id, monto, fechaRealizada, pagado) {

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
            console.log(this.pagos)
        });

    }

    modificarPago(pago) {

        Storebroker.editarPago(pago);

        this.pagos = this.pagos.map(r => {

            if(r.id_pago === pago.id_pago) {

                return pago;
            } else {

                return r;
            }
        });
    }

    registrarPago() {
        this.pagado = !this.pagado;
    }


    eliminarPago(pago) {

        Storebroker.eliminarPago(pago);
        this.pagos = this.pagos.filter(p => p.id_pago !== pago.id_pago)

    }

    pagosPendientes(){

        Storebroker.getPagosPendientes();
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

}

let pago = new Pago(5, 2, 3, 300, "2021-12-25", 0);

ContenedorPagos.build().then(cp => {
    console.log(cp)
    //cp.generarPago(pago.alumno_id, pago.paquete_id, pago.monto, pago.fechaRealizada, pago.pagado);
    //cp.getPagos();
    //cp.modificarPago(pago);
    //cp.eliminarPago(pago);

});

module.exports = {Pago, ContenedorPagos}
