const { getConnection } = require("../database/database");

const obtenerDatosBasicosDB = async (rut) => {

    const connection = await getConnection();
    const result = await connection.query('SELECT * FROM Data_Search WHERE rut = ?', [rut]);
    return result[0];
}

const guardarDatosBasicosDB = async (data) => {

    const connection = await getConnection();
    const result = await connection.query('INSERT INTO Data_Search SET ?', [data]);

    const result2 = await connection.query('SELECT * FROM Data_Search WHERE id_data_search = ?', [result.insertId]);
    return result2[0];
}

const editarDatosBasicosSimpleDB = async (data, id) => {
    const connection = await getConnection();
    
    const result = await connection.query('UPDATE Data_Search SET name = ? WHERE id_data_search = ?', [data.name, id]);

    const result2 = await connection.query('SELECT * FROM Data_Search WHERE id_data_search = ?', [id]);
    return result2[0];
}

const actualizarFechaBoletin = async (id, param) => {

    const connection = await getConnection();
    await connection.query(`UPDATE Data_Search SET ${param} = ? WHERE id_data_search = ?`, [new Date(), id]);
}

module.exports = {
    obtenerDatosBasicosDB,
    editarDatosBasicosSimpleDB,
    actualizarFechaBoletin,
    guardarDatosBasicosDB
}