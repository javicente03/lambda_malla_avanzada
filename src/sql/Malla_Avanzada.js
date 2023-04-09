const {getConnection} = require('../database/database');

const ObtenerBusqueda = async (id_busqueda) => {

    const connection = await getConnection();
    const busqueda = await connection.query('SELECT * FROM Escaneo_Malla_Avanzada WHERE id = ?', [id_busqueda]);
    
    return busqueda[0];
}

const ObtenerRutsBusqueda = async (id_busqueda) => {
    const connection = await getConnection();
    const ruts = await connection.query(`
        SELECT * FROM Ruts_Escaneados_Malla_Avanzada RE LEFT JOIN Malla_Avanzada_Detalle MAD ON RE.malla_avanzada_detalleId = MAD.id_malla_avanzada_detalle
        WHERE escaneo_malla_avanzadaId = ?`, [id_busqueda]);
    return ruts;
}

const ChangeStatusBusqueda = async (id_busqueda, status) => {
    const connection = await getConnection();
    const result = await connection.query('UPDATE Escaneo_Malla_Avanzada SET status = ? WHERE id = ?', [status, id_busqueda]);
    return result;
}

module.exports = {
    ObtenerBusqueda,
    ObtenerRutsBusqueda,
    ChangeStatusBusqueda
}