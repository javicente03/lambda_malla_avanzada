const { getConnection } = require("../database/database");

const FindProductInEscanner = async (busqueda_id, product_code) => {

    const connection = await getConnection();
    const busqueda = await connection.query(`
        SELECT * FROM Products_Escaneados_Malla_Avanzada PEMA LEFT JOIN Products_Malla_Avanzada PMA
        ON PEMA.product_malla_avanzadaId = PMA.id WHERE escaneo_malla_avanzadaId = ? AND PMA.code = ?`, [busqueda_id, product_code]);
    
    return busqueda[0];
}

module.exports = FindProductInEscanner;