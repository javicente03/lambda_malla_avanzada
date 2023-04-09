const {getConnection} = require('../database/database');

const guardarBoletinMorosidadesResumenDB = async (data) => {
    // const bolPenal = await prisma.Morosidades_Resumen.create({
    //     data: data
    // })

    // return bolPenal;

    const connection = await getConnection();
    const result = await connection.query('INSERT INTO Morosidades_Resumen SET ?', [data]);

    const result2 = await connection.query('SELECT * FROM Morosidades_Resumen WHERE id_morosidades_resumen = ?', [result.insertId]);
    return result2[0];
}

const guardarBoletinMorosidadesResumenYearDB = async (data) => {
    // await prisma.Morosidades_Resumen_Years.createMany({
    //     data: data,
    //     skipDuplicates: true
    // })

    if (data.length === 0) {
        return;
    }
    const connection = await getConnection();
    let keys = Object.keys(data[0]);
    let search = 'INSERT INTO Morosidades_Resumen_Years (' + keys.join(',') + ') VALUES ';
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        let values = Object.values(element);
        for (let i = 0; i < values.length; i++) {
            // elimina las comillas simples y dobles de los valores solo si es un string
            if (typeof values[i] === 'string') {
                values[i] = "'" + values[i].replace(/'/g, '').replace(/"/g, '') + "'";
            } else {
                values[i] = "'" + values[i] + "'";
            }
        }
        search += `(${values.join(', ')}),`;
    }
    search = search.slice(0, -1);
    await connection.query(search);
    // for (let index = 0; index < data.length; index++) {
    //     const element = data[index];
        
    //     await connection.query('INSERT INTO Morosidades_Resumen_Years SET ?', [element]);
    // }
}

const guardarBoletinMorosidadesDetalleDB = async (data) => {
    // await prisma.Morosidades_Detalle_Boletin_Informaciones_Comerciales.createMany({
    //     data: data,
    //     skipDuplicates: true
    // })   

    if (data.length === 0) {
        return;
    }
    const connection = await getConnection();
    let keys = Object.keys(data[0]);
    let search = 'INSERT INTO Morosidades_Detalle_Boletin_Informaciones_Comerciales (' + keys.join(',') + ') VALUES ';
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        let values = Object.values(element);
        for (let i = 0; i < values.length; i++) {
            // elimina las comillas simples y dobles de los valores solo si es un string
            if (typeof values[i] === 'string') {
                values[i] = "'" + values[i].replace(/'/g, '').replace(/"/g, '') + "'";
            } else {
                values[i] = "'" + values[i] + "'";
            }
        }
        search += `(${values.join(', ')}),`;
    }
    search = search.slice(0, -1);
    await connection.query(search);
    // for (let index = 0; index < data.length; index++) {
    //     const element = data[index];
        
    //     await connection.query('INSERT INTO Morosidades_Detalle_Boletin_Informaciones_Comerciales SET ?', [element]);
    // }
}

const guardarBoletinMorosidadesDetalleDBSis = async (data) => {
    // await prisma.Morosidades_Detalle_Sistema_Financiero.createMany({
    //     data: data,
    //     skipDuplicates: true
    // })   

    if (data.length === 0) {
        return;
    }
    const connection = await getConnection();
    let keys = Object.keys(data[0]);
    let search = 'INSERT INTO Morosidades_Detalle_Sistema_Financiero (' + keys.join(',') + ') VALUES ';
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        let values = Object.values(element);
        for (let i = 0; i < values.length; i++) {
            // elimina las comillas simples y dobles de los valores solo si es un string
            if (typeof values[i] === 'string') {
                values[i] = "'" + values[i].replace(/'/g, '').replace(/"/g, '') + "'";
            } else {
                values[i] = "'" + values[i] + "'";
            }
        }
        search += `(${values.join(', ')}),`;
    }
    search = search.slice(0, -1);
    await connection.query(search);
    // for (let index = 0; index < data.length; index++) {
    //     const element = data[index];
        
    //     await connection.query('INSERT INTO Morosidades_Detalle_Sistema_Financiero SET ?', [element]);
    // }
} 

const guardarListaAnosMorosidades = async (data) => {
    // await prisma.Morosidades_Resumen_Years_List.createMany({
    //     data: data,
    //     skipDuplicates: true
    // })

    if (data.length === 0) {
        return;
    }
    const connection = await getConnection();
    let keys = Object.keys(data[0]);
    let search = 'INSERT INTO Morosidades_Resumen_Years_List (' + keys.join(',') + ') VALUES ';
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        let values = Object.values(element);
        for (let i = 0; i < values.length; i++) {
            // elimina las comillas simples y dobles de los valores solo si es un string
            if (typeof values[i] === 'string') {
                values[i] = "'" + values[i].replace(/'/g, '').replace(/"/g, '') + "'";
            } else {
                values[i] = "'" + values[i] + "'";
            }
        }
        search += `(${values.join(', ')}),`;
    }
    search = search.slice(0, -1);
    await connection.query(search);
    // for (let index = 0; index < data.length; index++) {
    //     const element = data[index];
        
    //     await connection.query('INSERT INTO Morosidades_Resumen_Years_List SET ?', [element]);
    // }
}

const eliminarBoletinMorosidadesResumenDB =async (id) => {
    // await prisma.Morosidades_Resumen.deleteMany({
    //     where: {
    //         data_searchId: id
    //     }
    // })

    const connection = await getConnection();
    await connection.query('DELETE FROM Morosidades_Resumen WHERE data_searchId = ?', [id]);
}

const eliminarListaAnosMorosidades = async (id) => {
    // await prisma.Morosidades_Resumen_Years_List.deleteMany({
    //     where: {
    //         data_searchId: id
    //     }
    // })

    const connection = await getConnection();
    await connection.query('DELETE FROM Morosidades_Resumen_Years_List WHERE data_searchId = ?', [id]);
}

const eliminarBoletinMorosidadesDetalleDB = async (id) => {
    // await prisma.Morosidades_Detalle_Boletin_Informaciones_Comerciales.deleteMany({
    //     where: {
    //         data_searchId: id
    //     }
    // })

    const connection = await getConnection();
    await connection.query('DELETE FROM Morosidades_Detalle_Boletin_Informaciones_Comerciales WHERE data_searchId = ?', [id]);
}

const eliminarBoletinMorosidadesDetalleDBSis = async (id) => {
    // await prisma.Morosidades_Detalle_Sistema_Financiero.deleteMany({
    //     where: {
    //         data_searchId: id
    //     }
    // })

    const connection = await getConnection();
    await connection.query('DELETE FROM Morosidades_Detalle_Sistema_Financiero WHERE data_searchId = ?', [id]);
}

module.exports = {
    guardarBoletinMorosidadesResumenDB,
    guardarBoletinMorosidadesDetalleDB,
    guardarListaAnosMorosidades,
    guardarBoletinMorosidadesResumenYearDB,
    eliminarBoletinMorosidadesDetalleDB,
    eliminarBoletinMorosidadesResumenDB,
    eliminarListaAnosMorosidades,
    guardarBoletinMorosidadesDetalleDBSis,
    eliminarBoletinMorosidadesDetalleDBSis
}