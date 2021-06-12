function mediadorAsociarPaquete(contenedorAlumnos, contenedorPagos, contenedorPaquete) {

}

function mediadorPagosPaqueteAlumnos(contenedorPagos, contenedorPaquete, id_alumno) {
    // TODO: Tomar en cuenta cuando un pago no tiene paquete
    let pagos = contenedorPagos.getPagosAlumno({id_alumno: id_alumno})
    if (pagos.length === 0) {
        return pagos
    } else {
        pagos = groupBy("paquete_id")(pagos)
        let paquetesPagos = Object.keys(pagos).map(p_id => contenedorPaquete.getPaquete(Number(p_id)))
        let retorno = {}

        paquetesPagos.map(p => retorno[`[${p.id_paquete}]${p.nombre}`] = pagos[p.id_paquete])

        return retorno
    }
}

function groupBy(key) {
    // Funcion de utilidad -> retorna funcion que agrupa una lista por la key pasada
    return function group(array) {
        return array.reduce((acc, obj) => {
            const property = obj[key];
            acc[property] = acc[property] || [];
            acc[property].push(obj);
            return acc;
        }, {});
    };
}


module.exports = {
    // Funciones mediadores
    mediadorAsociarPaquete,
    mediadorPagosPaqueteAlumnos
}
