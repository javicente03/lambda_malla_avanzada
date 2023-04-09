'use strict'
const {getConnection} = require('../database/database');

const guardarComportamientoCivilResumen = async (data) => {
    // await prisma.ComportamientoCivilResumen.createMany({
    //     data: data,
    //     skipDuplicates: true
    // })

    if (data.length === 0) {
        return;
    }
    const connection = await getConnection();
    let keys = Object.keys(data[0]);
    let search = 'INSERT INTO ComportamientoCivilResumen (' + keys.join(',') + ') VALUES ';
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
        
    //     await connection.query('INSERT INTO ComportamientoCivilResumen SET ?', [element]);
    // }
}

const guardarComportamientoCivilDetalle = async (data) => {
    // const result = await prisma.ComportamientoCivilDetalle.create({
    //     data: data
    // })
    // return result;

    const connection = await getConnection();
    const result = await connection.query('INSERT INTO ComportamientoCivilDetalle SET ?', [data]);

    const result2 = await connection.query('SELECT * FROM ComportamientoCivilDetalle WHERE id_comportamiento_civil_detalle = ?', [result.insertId]);
    return result2[0];
}

const guardarTipoCuadernoCivil = async (data) => {
    // const result = await prisma.TipoCuadernoCivil.create({
    //     data: data
    // })

    // return result;

    const connection = await getConnection();
    const result = await connection.query('INSERT INTO TipoCuadernoCivil SET ?', [data]);

    const result2 = await connection.query('SELECT * FROM TipoCuadernoCivil WHERE id_tipo_cuaderno_civil = ?', [result.insertId]);
    return result2[0];
}

const guardarCuadernosCivil = async (data) => {
    // await prisma.CuadernosCivil.createMany({
    //     data: data,
    //     skipDuplicates: true
    // })

    if (data.length === 0) {
        return;
    }
    const connection = await getConnection();
    let keys = Object.keys(data[0]);
    let search = 'INSERT INTO CuadernosCivil (' + keys.join(',') + ') VALUES ';
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
        
    //     await connection.query('INSERT INTO CuadernosCivil SET ?', [element]);
    // }
}

const guardarLitigantesComportamientoCivil = async (data) => {
    // await prisma.LitigantesComportamientoCivil.createMany({
    //     data: data,
    //     skipDuplicates: true
    // })

    const connection = await getConnection();
    // Insertar multiples registros en una sola consulta, los registros se encuentran en un array data, de alli deben extraerse y armar la consulta
    let keys = Object.keys(data[0]);
    let search = 'INSERT INTO LitigantesComportamientoCivil (' + keys.join(',') + ') VALUES ';
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
        
    //     await connection.query('INSERT INTO LitigantesComportamientoCivil SET ?', [element]);
    // }
}

const eliminarComportamientoCivilResumen = async (id) => {
    // await prisma.ComportamientoCivilResumen.deleteMany({
    //     where: {
    //         data_searchId: id
    //     }
    // })

    const connection = await getConnection();
    await connection.query('DELETE FROM ComportamientoCivilResumen WHERE data_searchId = ?', [id]);
}

const eliminarComportamientoCivilDetalle = async (id) => {
    // await prisma.ComportamientoCivilDetalle.deleteMany({
    //     where: {
    //         data_searchId: id
    //     }
    // })

    const connection = await getConnection();
    await connection.query('DELETE FROM ComportamientoCivilDetalle WHERE data_searchId = ?', [id]);
}

module.exports = {
    guardarComportamientoCivilDetalle,
    guardarComportamientoCivilResumen,
    guardarCuadernosCivil,
    guardarLitigantesComportamientoCivil,
    eliminarComportamientoCivilDetalle,
    eliminarComportamientoCivilResumen,
    guardarTipoCuadernoCivil
}