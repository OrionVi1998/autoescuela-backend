
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

    getPagos() {}
    registrarPago() {}
    modificarPago() {
        this.pagado = true
    }

    eliminarPago() {}
    generarPagos() {

    }

    pagosPendientes() {
        // storebroker
    }

}

module.exports = Pago
