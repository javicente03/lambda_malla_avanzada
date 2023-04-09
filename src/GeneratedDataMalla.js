const { getConnection } = require("./database/database");
const VerificadorPersonaNatural = require("./functions/VerificadorPersonaNatural");
const { obtenerDatosBasicosDB } = require("./sql/Data_Search");

const GeneratedDataMalla = async (busqueda, rut, productosSeleccionados) => {

    const connection = await getConnection();

    const person = await obtenerDatosBasicosDB(rut.rut);

    if (productosSeleccionados.morosidad) {
        console.log('morosidad true')
        await connection.query(`
            UPDATE Malla_Avanzada_Detalle SET boolean_morosidad = 1 WHERE id_malla_avanzada_detalle = ?`, [rut.malla_avanzada_detalleId]);
    }

    // DATA DEMANDAS INICIO -------------------------------------------------------------------------------------------------------------------------------
    if (productosSeleccionados.demandas) {
        console.log('demandas true')
        await connection.query(`
            UPDATE Malla_Avanzada_Detalle SET boolean_demandas = 1 WHERE id_malla_avanzada_detalle = ?`, [rut.malla_avanzada_detalleId]);

        // Obtener las demandas a las que el rut consultado esta asociado solo demandantes y demandados
        const dataDetalleCivil = await connection.query(`
            SELECT * FROM LitigantesComportamientoCivil AS LCC LEFT JOIN ComportamientoCivilDetalle AS CCD ON
            LCC.comportamiento_civilDetalleId = CCD.id_comportamiento_civil_detalle WHERE CCD.data_searchId = ?
            AND (LCC.participante = 'Demandante' OR LCC.participante = 'Demandado')
        `, [person.id_data_search]);

        console.log('person.id_data_search', person.id_data_search)
        console.log('dataDetalleVigDB', dataDetalleCivil.length)

        for (let index = 0; index < dataDetalleCivil.length; index++) {
            const element = dataDetalleCivil[index];
            
            const relacion_existente = await connection.query(`
                SELECT * FROM ROL_Demanda_Malla_Avanzada WHERE malla_avanzada_detalleId = ? AND rol = ?
            `, [rut.malla_avanzada_detalleId, element.rol]);
    
            let relacion_final = null;
            if (relacion_existente.length > 0) {
                relacion_final = relacion_existente[0].id;
            } else {
                const creada = await connection.query(`
                    INSERT INTO ROL_Demanda_Malla_Avanzada (malla_avanzada_detalleId, rol, juzgado) VALUES (?, ?, ?)
                `, [rut.malla_avanzada_detalleId, element.rol, element.tribunal]);
    
                relacion_final = creada.insertId;
            }
    
            await connection.query(`
                INSERT INTO Asociados_ROL_Demanda_Malla_Avanzada (nombre, rut, participacion, rol_demanda_malla_avanzadaId) VALUES (?, ?, ?, ?)
            `, [element.nombre, element.rut, element.participante, relacion_final]);  
        }
    }

    // DATA DEMANDAS FIN -------------------------------------------------------------------------------------------------------------------------------

    // DATA PENAL INICIO -------------------------------------------------------------------------------------------------------------------------------
    if (productosSeleccionados.penal && VerificadorPersonaNatural(rut.rut) && !rut.boolean_penal) {
        console.log('penal true')
        await connection.query(`
            UPDATE Malla_Avanzada_Detalle SET boolean_penal = 1 WHERE id_malla_avanzada_detalle = ?`, [rut.malla_avanzada_detalleId]);

        // Obtener los delitos a los que el rut consultado esta asociado

        const dataDetalleVigDB = await connection.query(`
            SELECT * FROM RelacionesPenalDetalle AS RPD LEFT JOIN ComportamientoPenalDetalle AS CPD ON 
            RPD.comportamiento_penalDetalleId = CPD.id_comportamiento_penal_detalle WHERE CPD.data_searchId = ?
            AND (CPD.participacion LIKE '%Denunciado.%' OR CPD.participacion LIKE '%Querellado.%' OR CPD.participacion LIKE '%Imputado.%')
        `, [person.id_data_search]);

        console.log('person.id_data_search', person.id_data_search)
        console.log('dataDetalleVigDB', dataDetalleVigDB.length)

        const detenciones = await connection.query(`
            SELECT * FROM Detenciones WHERE data_searchId = ?
        `, [person.id_data_search]);

        for (let index = 0; index < dataDetalleVigDB.length; index++) {
            const element = dataDetalleVigDB[index];
            
            const relacion_existente = await connection.query(`
                SELECT * FROM RUC_Delito_Malla_Avanzada WHERE malla_avanzada_detalleId = ? AND ruc = ?
            `, [rut.malla_avanzada_detalleId, element.ruc]);
    
            let relacion_final = null;
            if (relacion_existente.length > 0) {
                relacion_final = relacion_existente[0].id;
            } else {
                const creada = await connection.query(`
                    INSERT INTO RUC_Delito_Malla_Avanzada (malla_avanzada_detalleId, ruc) VALUES (?, ?)
                `, [rut.malla_avanzada_detalleId, element.ruc]);
    
                relacion_final = creada.insertId;
            }
    
            // busca en nombre sin distincion de mayusculas y minusculas
            const ya_existe_relacionado = await connection.query(`
                SELECT * FROM Asociados_RUC_Delito_Malla_Avanzada WHERE nombre LIKE ? AND delito LIKE ? AND ruc_delito_malla_avanzadaId = ?
            `, [element.nombre, element.delito, relacion_final]);
    
            if (ya_existe_relacionado.length > 0) {
                continue;
            }
    
            await connection.query(`
                INSERT INTO Asociados_RUC_Delito_Malla_Avanzada (nombre, delito, ruc_delito_malla_avanzadaId) VALUES (?, ?, ?)
            `, [element.nombre, element.delito, relacion_final]);
        }

        for (let index = 0; index < detenciones.length; index++) {
            const element = detenciones[index];
            
            const match_ruc = await connection.query(`
                SELECT * FROM Detenciones AS DET LEFT JOIN Data_Search AS DS ON DET.data_searchId = DS.id_data_search WHERE ruc = ?
            `, [element.ruc]);
    
            console.log("Match RUC");
            console.log(match_ruc);
    
            for (let index = 0; index < match_ruc.length; index++) {
                const relacion = match_ruc[index];

                const relacion_existente = await connection.query(`
                    SELECT * FROM RUC_Delito_Malla_Avanzada WHERE malla_avanzada_detalleId = ? AND ruc = ?
                `, [rut.malla_avanzada_detalleId, relacion.ruc]);
    
                let relacion_final = null;
                if (relacion_existente.length > 0) {
                    relacion_final = relacion_existente[0].id;
                } else {

                    const creada = await connection.query(`
                        INSERT INTO RUC_Delito_Malla_Avanzada (malla_avanzada_detalleId, ruc) VALUES (?, ?)
                    `, [rut.malla_avanzada_detalleId, relacion.ruc]);
    
                    relacion_final = creada.insertId;
                }
    
                // busca en nombre sin distincion de mayusculas y minusculas
                const ya_existe_relacionado = await connection.query(`
                    Asociados_RUC_Delito_Malla_Avanzada WHERE nombre LIKE ? AND delito LIKE ? AND ruc_delito_malla_avanzadaId = ?
                `, [relacion.name, relacion.delito, relacion_final]);
    
                if (ya_existe_relacionado.length > 0) {
                    continue;
                }

                await connection.query(`
                    INSERT INTO Asociados_RUC_Delito_Malla_Avanzada (nombre, delito, ruc_delito_malla_avanzadaId) VALUES (?, ?, ?)
                `, [relacion.name, relacion.delito, relacion_final]);
            }
        }
    }

    // DATA PENAL FIN -------------------------------------------------------------------------------------------------------------------------------
}

module.exports = GeneratedDataMalla;