'use strict'
const {getConnection} = require('../database/database');

const guardarComportamientoPenalResumen = async (data) => {
    // await prisma.ComportamientoPenalResumen.createMany({
    //     data: data,
    //     skipDuplicates: true
    // })

    if (data.length === 0) {
        return;
    }
    const connection = await getConnection();
    let keys = Object.keys(data[0]);
    let search = 'INSERT INTO ComportamientoPenalResumen (' + keys.join(',') + ') VALUES ';
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
        
    //     await connection.query('INSERT INTO ComportamientoPenalResumen SET ?', [element]);
    // }
}

const guardarComportamientoPenalDetalle = async (data) => {
    // const result = await prisma.ComportamientoPenalDetalle.create({
    //     data: data
    // });
    // return result;

    const connection = await getConnection();
    const result = await connection.query('INSERT INTO ComportamientoPenalDetalle SET ?', [data]);

    const result2 = await connection.query('SELECT * FROM ComportamientoPenalDetalle WHERE id_comportamiento_penal_detalle = ?', [result.insertId]);
    return result2[0];
}

const guardarRelacionesPenalDetalle = async (data) => {
    // await prisma.RelacionesPenalDetalle.createMany({
    //     data: data,
    //     skipDuplicates: true
    // })

    if (data.length === 0) {
        return;
    }
    const connection = await getConnection();
    let keys = Object.keys(data[0]);
    let search = 'INSERT INTO RelacionesPenalDetalle (' + keys.join(',') + ') VALUES ';
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
        
    //     await connection.query('INSERT INTO RelacionesPenalDetalle SET ?', [element]);
    // }
}

const guardarLitigantesPenal = async (data) => {
    // await prisma.LitigantesComportamientoPenal.createMany({
    //     data: data,
    //     skipDuplicates: true
    // })

    if (data.length === 0) {
        return;
    }
    const connection = await getConnection();
    let keys = Object.keys(data[0]);
    let search = 'INSERT INTO LitigantesComportamientoPenal (' + keys.join(',') + ') VALUES ';
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
        
    //     await connection.query('INSERT INTO LitigantesComportamientoPenal SET ?', [element]);
    // }
}

const guardarTramitesPenal = async (data) => {
    // await prisma.TramitesComportamientoPenal.createMany({
    //     data: data,
    //     skipDuplicates: true
    // })

    if (data.length === 0) {
        return;
    }
    const connection = await getConnection();
    let keys = Object.keys(data[0]);
    let search = 'INSERT INTO TramitesComportamientoPenal (' + keys.join(',') + ') VALUES ';
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
        
    //     await connection.query('INSERT INTO TramitesComportamientoPenal SET ?', [element]);
    // }
}

const guardarNotificacionesPenal = async (data) => {
    // await prisma.NotificacionesComportamientoPenal.createMany({
    //     data: data,
    //     skipDuplicates: true
    // })

    if (data.length === 0) {
        return;
    }
    const connection = await getConnection();
    let keys = Object.keys(data[0]);
    let search = 'INSERT INTO NotificacionesComportamientoPenal (' + keys.join(',') + ') VALUES ';
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
        
    //     await connection.query('INSERT INTO NotificacionesComportamientoPenal SET ?', [element]);
    // }
}

const eliminarComportamientoPenalResumen = async (id) => {
    // await prisma.ComportamientoPenalResumen.deleteMany({
    //     where: {
    //         data_searchId: id
    //     }
    // })

    const connection = await getConnection();
    await connection.query('DELETE FROM ComportamientoPenalResumen WHERE data_searchId = ?', [id]);
}

const eliminarComportamientoPenalDetalle = async (id) => {
    // await prisma.ComportamientoPenalDetalle.deleteMany({
    //     where: {
    //         data_searchId: id
    //     }
    // })

    const connection = await getConnection();
    await connection.query('DELETE FROM ComportamientoPenalDetalle WHERE data_searchId = ?', [id]);
}

module.exports = {
    guardarComportamientoPenalDetalle,
    guardarComportamientoPenalResumen,
    guardarLitigantesPenal,
    guardarNotificacionesPenal,
    guardarTramitesPenal,
    guardarRelacionesPenalDetalle,
    eliminarComportamientoPenalDetalle,
    eliminarComportamientoPenalResumen
}