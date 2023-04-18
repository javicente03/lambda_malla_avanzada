const config = require("./config");
const { getConnection } = require("./database/database");
const moment = require("moment");
const VerificadorPersonaNatural = require("./functions/VerificadorPersonaNatural");
const CreatePdfResumen = require("./helpers/dealernet/pdf/createPdfResumen");
const FormatRut = require("./functions/formatRut");

const GeneratedResumen = async (id) => {
    const connection = await getConnection();
    const malla = await connection.query(`
    SELECT * FROM Malla_Avanzada 
    LEFT JOIN Data_Search_User ON Malla_Avanzada.data_search_userId = Data_Search_User.id_data_search_user
    WHERE id_malla_avanzada = ?`, [id]);

    const delitosUaf = await connection.query(`
        SELECT * FROM Delitos_Listado WHERE tipo_delito = 'uaf'
    `);

    const delitosGraves = await connection.query(`
        SELECT * FROM Delitos_Listado WHERE tipo_delito = 'grave'   
    `);

    let data = {
        empresas_asociadas_al_rut: 0,
        socios_asociados_al_rut: 0,
        delitos_asociados_al_rut: 0,
        demandas_asociadas_al_rut: 0,
        morosidad_asociada_al_rut: 0,
        empresas_con_demandas: 0,
        empresas_con_morosidad: 0,
        socios_imputados_en_delitos: 0,
        socios_demandados: 0,
        socios_con_morosidad: 0,
        persona_que_mas_se_repite: null,
        total_delitos_bases_uaf: 0,
        total_delitos_graves: 0,
        total_morosidad_empresas: 0,
        total_morosidad_socios: 0,
        total_bancos_detectados: 0,
        // companeros_delitos: 0,
        // delitos_bases_uaf: 0,
        // delitos_graves: 0,
        // otros_delitos: 0,
        // empresas_vinculadas_al_rut: 0,
        // socios_vinculados_al_rut: 0,
    }

    // Obtener todas las empresas relacionadas al principal donde malla_avanzada_detalleId = id
    // y donde rut distinto a malla[0].rut
    // no repetir el rut
    const cantidad_socios_sociedades = await connection.query(`
        SELECT * FROM Malla_Avanzada_Detalle WHERE malla_avanzadaId = ? AND rut != ? GROUP BY rut
    `, [id, malla[0].rut]);

    const primer_elemento = await connection.query(`
        SELECT * FROM Malla_Avanzada_Detalle WHERE malla_avanzadaId = ? AND id_relacion_directa IS NULL
    `, [id]);

    const cantidad_delitos = await connection.query(`
        SELECT COUNT(*) AS total_delitos FROM RUC_Delito_Malla_Avanzada WHERE malla_avanzada_detalleId = ?
    `, [primer_elemento[0].id_malla_avanzada_detalle]);

    const cantidad_demandas = await connection.query(`
        SELECT COUNT(*) AS total_demandas FROM ROL_Demanda_Malla_Avanzada WHERE malla_avanzada_detalleId = ?
    `, [primer_elemento[0].id_malla_avanzada_detalle]);

    const cantidad_empresas_socios_con_demandas = await connection.query(`
        SELECT * FROM Malla_Avanzada_Detalle WHERE malla_avanzadaId = ? AND rut != ? 
        AND cantidad_demandas > 0 GROUP BY rut
    `, [id, malla[0].rut]);

    const cantidad_empresas_socios_con_morosidad = await connection.query(`
        SELECT * FROM Malla_Avanzada_Detalle WHERE malla_avanzadaId = ? AND rut != ?
        AND morosidad_cantidad > 0 GROUP BY rut
    `, [id, malla[0].rut]);

    const cantidad_socios_con_delitos = await connection.query(`
        SELECT * FROM RUC_Delito_Malla_Avanzada RDMA
        LEFT JOIN Malla_Avanzada_Detalle MAD ON RDMA.malla_avanzada_detalleId = MAD.id_malla_avanzada_detalle
        LEFT JOIN Malla_Avanzada MA ON MAD.malla_avanzadaId = MA.id_malla_avanzada
        WHERE MA.id_malla_avanzada = ? AND MAD.rut != ? GROUP BY MAD.rut
    `, [id, malla[0].rut]);

    const persona_que_mas_se_repite_mad = await connection.query(`
        SELECT * FROM Malla_Avanzada_Detalle WHERE malla_avanzadaId = ? AND rut != ?
    `, [id, malla[0].rut]);

    const persona_que_mas_se_repite_penal = await connection.query(`
        SELECT DISTINCT*, ARDMA.nombre AS nombre_asociado FROM Asociados_RUC_Delito_Malla_Avanzada ARDMA
        LEFT JOIN RUC_Delito_Malla_Avanzada RDMA ON ARDMA.ruc_delito_malla_avanzadaId = RDMA.id
        LEFT JOIN Malla_Avanzada_Detalle MAD ON RDMA.malla_avanzada_detalleId = MAD.id_malla_avanzada_detalle
        LEFT JOIN Malla_Avanzada MA ON MAD.malla_avanzadaId = MA.id_malla_avanzada
        WHERE MA.id_malla_avanzada = ? AND ARDMA.nombre != ?
        GROUP BY RDMA.id
    `, [id, malla[0].name_rut]);

    const persona_que_mas_se_repite_demanda = await connection.query(`
        SELECT DISTINCT *, ARDMA.nombre AS nombre_asociado FROM Asociados_ROL_Demanda_Malla_Avanzada ARDMA
        LEFT JOIN ROL_Demanda_Malla_Avanzada RDMA ON ARDMA.rol_demanda_malla_avanzadaId = RDMA.id
        LEFT JOIN Malla_Avanzada_Detalle MAD ON RDMA.malla_avanzada_detalleId = MAD.id_malla_avanzada_detalle
        LEFT JOIN Malla_Avanzada MA ON MAD.malla_avanzadaId = MA.id_malla_avanzada
        WHERE MA.id_malla_avanzada = ? AND ARDMA.rut != ?
        GROUP BY RDMA.id
    `, [id, malla[0].rut]);

    const delitos_asociados_al_rut = await connection.query(`
        SELECT DISTINCT*, ARDMA.nombre AS nombre_asociado FROM Asociados_RUC_Delito_Malla_Avanzada ARDMA
        LEFT JOIN RUC_Delito_Malla_Avanzada RDMA ON ARDMA.ruc_delito_malla_avanzadaId = RDMA.id
        LEFT JOIN Malla_Avanzada_Detalle MAD ON RDMA.malla_avanzada_detalleId = MAD.id_malla_avanzada_detalle
        LEFT JOIN Malla_Avanzada MA ON MAD.malla_avanzadaId = MA.id_malla_avanzada
        WHERE MA.id_malla_avanzada = ?
        GROUP BY RDMA.ruc
    `, [id]);


    const nombres_almacenados = [];
    for (let index = 0; index < persona_que_mas_se_repite_mad.length; index++) {
        let posicionExiste = nombres_almacenados.findIndex((item) => item.nombre == persona_que_mas_se_repite_mad[index].nombre);

        if (posicionExiste == -1) {
            nombres_almacenados.push({
                nombre: persona_que_mas_se_repite_mad[index].nombre,
                cantidad: 1,
                rut: persona_que_mas_se_repite_mad[index].rut
            });
        } else {
            nombres_almacenados[posicionExiste].cantidad++;
            nombres_almacenados[posicionExiste].rut = persona_que_mas_se_repite_mad[index].rut;
        }
    }

    let cantidad_delitos_uaf = 0;
    let cantidad_delitos_graves = 0;
    let cantidad_delitos_otros = 0;

    for (let index = 0; index < persona_que_mas_se_repite_penal.length; index++) {
        let posicionExiste = nombres_almacenados.findIndex((item) => item.nombre == persona_que_mas_se_repite_penal[index].nombre_asociado);

        if (posicionExiste == -1) {
            nombres_almacenados.push({
                nombre: persona_que_mas_se_repite_penal[index].nombre_asociado,
                cantidad: 1
            });
        } else {
            nombres_almacenados[posicionExiste].cantidad++;
        }
    }

    for (let index = 0; index < persona_que_mas_se_repite_demanda.length; index++) {
        let posicionExiste = nombres_almacenados.findIndex((item) => item.nombre == persona_que_mas_se_repite_demanda[index].nombre_asociado);
        
        if (posicionExiste == -1) {
            nombres_almacenados.push({
                nombre: persona_que_mas_se_repite_demanda[index].nombre_asociado,
                cantidad: 1,
                rut: persona_que_mas_se_repite_demanda[index].rut
            });
        } else {
            nombres_almacenados[posicionExiste].cantidad++;
            nombres_almacenados[posicionExiste].rut = persona_que_mas_se_repite_demanda[index].rut;
        }
    }

    for (let index = 0; index < delitos_asociados_al_rut.length; index++) {
        if (delitosGraves.some((item) => item.delito.toLowerCase().replace(/\s/g, '') == delitos_asociados_al_rut[index].delito.toLowerCase().replace(/\s/g, ''))) {
            cantidad_delitos_graves++;
        } else if (delitosUaf.some((item) => item.delito.toLowerCase().replace(/\s/g, '') == delitos_asociados_al_rut[index].delito.toLowerCase().replace(/\s/g, ''))) {
            cantidad_delitos_uaf++;
        } else {
            cantidad_delitos_otros++;
        }
    }

    // obten la suma de las morosidades de cantidad_empresas_socios_con_morosidad dividiendo entre socios y sociedades

    let total_morosidad_empresas = 0;
    let total_morosidad_socios = 0;

    for (let index = 0; index < cantidad_empresas_socios_con_morosidad.length; index++) {
        if (VerificadorPersonaNatural(cantidad_empresas_socios_con_morosidad[index].rut)) {
            total_morosidad_socios += cantidad_empresas_socios_con_morosidad[index].morosidad_cantidad;
        } else {
            total_morosidad_empresas += cantidad_empresas_socios_con_morosidad[index].morosidad_cantidad;
        }
    }

    const total_bancos_detectados = await connection.query(`
        SELECT COUNT(DISTINCT BAM.nombre) AS total_bancos
        FROM Bancos_Asociados_Malla_Avanzada BAM
        LEFT JOIN Malla_Avanzada_Detalle MAD ON BAM.malla_avanzada_detalleId = MAD.id_malla_avanzada_detalle
        LEFT JOIN Malla_Avanzada MA ON MAD.malla_avanzadaId = MA.id_malla_avanzada
        WHERE MA.id_malla_avanzada = ?
    `, [id]);

    // const companeros_delitos = await connection.query(`
    //     SELECT DISTINCT ARDMA.nombre, ARDMA.nombre
    //     FROM Asociados_RUC_Delito_Malla_Avanzada ARDMA
    //     LEFT JOIN RUC_Delito_Malla_Avanzada RDMA ON ARDMA.ruc_delito_malla_avanzadaId = RDMA.id
    //     LEFT JOIN Malla_Avanzada_Detalle MAD ON RDMA.malla_avanzada_detalleId = MAD.id_malla_avanzada_detalle
    //     LEFT JOIN Malla_Avanzada MA ON MAD.malla_avanzadaId = MA.id_malla_avanzada
    //     WHERE MA.id_malla_avanzada = ? AND ARDMA.nombre != ?     
    // `, [id, malla[0].name_rut]);

    nombres_almacenados.sort((a, b) => b.cantidad - a.cantidad);

    let nombre_mas_repetido_final = '';
    if (nombres_almacenados.length > 0) {
        let rut_nombre_mas_repetido = nombres_almacenados[0].rut && nombres_almacenados[0].rut != '' ? FormatRut(nombres_almacenados[0].rut) : '';
        nombre_mas_repetido_final = nombres_almacenados[0].nombre + ' ' + rut_nombre_mas_repetido;
    }

    data.empresas_asociadas_al_rut = cantidad_socios_sociedades.filter((item) => !VerificadorPersonaNatural(item.rut)).length;
    data.socios_asociados_al_rut = cantidad_socios_sociedades.filter((item) => VerificadorPersonaNatural(item.rut)).length;
    data.delitos_asociados_al_rut = cantidad_delitos[0].total_delitos;
    data.demandas_asociadas_al_rut = cantidad_demandas[0].total_demandas;
    data.morosidad_asociada_al_rut = primer_elemento[0].morosidad_cantidad;
    data.empresas_con_demandas = cantidad_empresas_socios_con_demandas.filter((item) => !VerificadorPersonaNatural(item.rut)).length;
    data.empresas_con_morosidad = cantidad_empresas_socios_con_morosidad.filter((item) => !VerificadorPersonaNatural(item.rut)).length;
    data.socios_imputados_en_delitos = cantidad_socios_con_delitos.length;
    data.socios_demandados = cantidad_empresas_socios_con_demandas.filter((item) => VerificadorPersonaNatural(item.rut)).length;
    data.socios_con_morosidad = cantidad_empresas_socios_con_morosidad.filter((item) => VerificadorPersonaNatural(item.rut)).length;
    data.persona_que_mas_se_repite = nombre_mas_repetido_final;
    data.total_delitos_bases_uaf = cantidad_delitos_uaf;
    data.total_delitos_graves = cantidad_delitos_graves;
    data.total_morosidad_empresas = total_morosidad_empresas;
    data.total_morosidad_socios = total_morosidad_socios;
    data.total_bancos_detectados = total_bancos_detectados[0].total_bancos;
    // data.companeros_delitos = companeros_delitos.length;
    // data.delitos_bases_uaf = cantidad_delitos_uaf;
    // data.delitos_graves = cantidad_delitos_graves;
    // data.otros_delitos = cantidad_delitos_otros;
    // data.empresas_vinculadas_al_rut = cantidad_socios_sociedades.filter((item) => !VerificadorPersonaNatural(item.rut)).length;
    // data.socios_vinculados_al_rut = cantidad_socios_sociedades.filter((item) => VerificadorPersonaNatural(item.rut)).length;

    const link = await CreatePdfResumen(data, malla[0]);

    return link;
}

module.exports = GeneratedResumen;