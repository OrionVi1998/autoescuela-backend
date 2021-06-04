
class Paquete {

    id_paquete;
    nombre;
    cantClases;
    duracionClase;
    precio;
    estado;

    // TODO: agregar constructor para un objeto desde la BD
    constructor(id_paquete, nombre, cantClases, duracionClase, precio, estado = 1) {

        this.id_paquete = id_paquete
        this.nombre = nombre
        this.cantClases = cantClases
        this.duracionClase = duracionClase
        this.precio = precio
        this.estado = estado
    }

    getPaquete() {}
    crearPaquete() {}
    editarPaquete() {}
    eliminarProfesor() {}

    cambiarEstado() {
        this.estado = !this.estado
    }


}

export default Paquete
