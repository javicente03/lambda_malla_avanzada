const { getConnection } = require("../../../database/database");

const GenerarMorosidadPdf = async (dataSearch) => {

    const connection = await getConnection();
    const dataDB = await connection.query(`
        SELECT *, Morosidades_Resumen.cantidad AS cantidad_total_unit FROM Morosidades_Resumen
        LEFT JOIN Morosidades_Resumen_Years ON Morosidades_Resumen.id_morosidades_resumen = Morosidades_Resumen_Years.morosidades_resumenId
        WHERE Morosidades_Resumen.data_searchId = ?
    `, [dataSearch.id_data_search]);

    let dataDBClean = [];

    for (let i = 0; i < dataDB.length; i++) {
        const element = dataDB[i];
        let index = dataDBClean.findIndex((item) => item.id_morosidades_resumen === element.id_morosidades_resumen);
        if (index === -1) {
            dataDBClean.push({
                // id_morosidades_resumen: element.id_morosidades_resumen,
                id_morosidades_resumen: element.id_morosidades_resumen,
                data_searchId: element.data_searchId,
                tipo_morosidad: element.tipo_morosidad,
                cantidad: element.cantidad_total_unit,
                years: [{
                    id_morosidades_resumen_years: element.id_morosidades_resumen_years,
                    morosidades_resumenId: element.morosidades_resumenId,
                    year: element.year,
                    cantidad: element.cantidad
                }]
            })
        } else {
            dataDBClean[index].years.push({
                id_morosidades_resumen_years: element.id_morosidades_resumen_years,
                morosidades_resumenId: element.morosidades_resumenId,
                year: element.year,
                cantidad: element.cantidad
            })
        }
    }

    const summaryDB = await connection.query(`
        SELECT SUM(cantidad) AS cantidad FROM Morosidades_Resumen WHERE data_searchId = ?
    `, [dataSearch.id_data_search]);

    const listYear = await connection.query(`
        SELECT * FROM Morosidades_Resumen_Years_List WHERE data_searchId = ? ORDER BY year DESC
    `, [dataSearch.id_data_search]);

    let htmlResumen = `<div id="bolpenal">
                    <h6 class="titleSeccion">Morosidad</h6>
                    <hr class="hrSeccion">
                    <br>
                    ${dataDBClean.length > 0 ? `
                    <h6 class="titleSeccion">Resúmen</h6>
                    <hr class="hrSeccion">
                    
                    <table class="tableBasic">
                        <thead>
                            <tr class="trBasic trfz12">
                                <th class="tdGray">INDICE</th>
                                <th class="tdGray">Cantidad</th>
                                ${listYear.map((year) => {
                                    return `<th class="tdGray">${year.year}</th>`
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            ${
                                dataDBClean.map((item) => {
                                    
                                    return `<tr class="trBasic trfz12">
                                                <td>${item.tipo_morosidad}</td>
                                                <td class="tdCenter">${item.cantidad}</td>
                                                ${item.years.map((year) => {
                                                    return `<td class="tdCenter">${year.cantidad}</td>`
                                                })}
                                            </tr>`
                                })
                            }
                            <tr class="trBasic trfz12">
                                <td>Total</td>
                                <td class="tdCenter tdColorRed">${summaryDB[0].cantidad}</td>
                                ${listYear.map((year) => {
                                    return `<td class="tdCenter tdColorRed">${year.cantidad}</td>`
                                })}
                            </tr>
                        </tbody>
                    </table>`
                    : `<div class="divInfoSingle"><h6 class="noInfo" >No hay información para mostrar</h6></div>`}
                    `;


    htmlResumen = htmlResumen.replace(/,/g, '');

    const dataDB2 = await connection.query(`
        SELECT * FROM Morosidades_Detalle_Boletin_Informaciones_Comerciales WHERE data_searchId = ?
    `, [dataSearch.id_data_search]);

    let flagClass = true;

    let htmlDetalle1 = '';

    if (dataDB.length > 0) {
        htmlDetalle1 = `<br>
                        <h6 class="titleSeccion">Detalle Boletín de Informaciones Comerciales</h6>
                        <hr class="hrSeccion">
                        
                        <table class="tableBasic">
                            <thead>
                                <tr class="trBasic">
                                    <th class="tdGray thfz11 tdw30">CODIGO EMISOR</th>
                                    <th class="tdGray thfz11 tdw20">FECHA PROTESTO</th>
                                    <th class="tdGray thfz11 tdw20">FECHA PUBLICACIÓN</th>
                                    <th class="tdGray thfz11 tdw30">FECHA VENCIMIENTO</th>
                                    <th class="tdGray thfz11 tdw30">EMISOR</th>
                                </tr>
                                <tr class="trBasic">
                                    <th class="tdGray thfz11">MONEDA</th>
                                    <th class="tdGray thfz11">TIPO DOCUMENTO</th>
                                    <th class="tdGray thfz11">TIPO DOCUMENTO IMPAGO</th>
                                    <th class="tdGray thfz11">TIPO EMISOR</th>
                                    <th class="tdGray thfz11">LOCALIDAD PUBLICACION</th>
                                </tr>
                                <tr class="trBasic">
                                    <th class="tdGray thfz11">MONTO DEUDA</th>
                                    <th class="tdGray thfz11">NOMBRE LIBRADOR</th>
                                    <th class="tdGray thfz11">Nº BOLETÍN</th>
                                    <th class="tdGray thfz11">Nº OPERACIÓN</th>
                                    <th class="tdGray thfz11">PAGO BOLETÍN</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${dataDB2.map((item) => {
                                    flagClass = !flagClass;
                                    return `<tr class="trBasic ${flagClass ? 'trGray' : ''}">
                                                <td class="tdCenter">${item.codigo_emisor}</td>
                                                <td class="tdCenter">${item.fecha_protesto}</td>
                                                <td class="tdCenter">${item.fecha_publicacion}</td>
                                                <td class="tdCenter">${item.fecha_vencimiento}</td>
                                                <td class="tdCenter">${item.emisor}</td>
                                            </tr>
                                            <tr class="trBasic ${flagClass ? 'trGray' : ''}">
                                                <td class="tdCenter">${item.moneda} (${item.moneda_simbolo})</td>
                                                <td class="tdCenter">${item.tipo_documento} (${item.tipado_documento})</td>
                                                <td class="tdCenter">${item.tipo_documento_impago} (${item.tipado_documento_impago})</td>
                                                <td class="tdCenter">${item.tipo_emisor} (${item.tipado_emisor})</td>
                                                <td class="tdCenter">${item.localidad_publicacion}</td>
                                            </tr>
                                            <tr class="trBasic ${flagClass ? 'trGray' : ''}">
                                                <td class="tdCenter">${item.monto_deuda}</td>
                                                <td class="tdCenter">${item.nombre_librador}</td>
                                                <td class="tdCenter">${item.nro_boletin}</td>
                                                <td class="tdCenter">${item.nro_operacion}</td>
                                                <td class="tdCenter">${item.pago_boletin}</td>
                                            </tr>
                                            `;
                                })}
                            </tbody>
                        </table>
                    `;
    }

    htmlDetalle1 = htmlDetalle1 + '</div>';
    htmlDetalle1 = htmlDetalle1.replace(/,/g, '');

    let htmlDetalle2 = '';

    const dataDB3 = await connection.query(`
        SELECT * FROM Morosidades_Detalle_Sistema_Financiero WHERE data_searchId = ?
    `, [dataSearch.id_data_search]);

    if (dataDB3.length > 0) {
        htmlDetalle2 = `<br>
                        <h6 class="titleSeccion">Detalle Morosidad en Sistemas Financiero/Comercial- Morosidad en línea</h6>
                        <hr class="hrSeccion">

                        <table class="tableBasic">
                            <thead>
                                <tr class="trBasic">
                                    <th class="tdGray thfz11 tdw30">CODIGO EMISOR</th>
                                    <th class="tdGray thfz11 tdw20">FECHA VENCIMIENTO</th>
                                    <th class="tdGray thfz11 tdw20">EMISOR</th>
                                    <th class="tdGray thfz11 tdw30">MONEDA</th>
                                </tr>
                                <tr class="trBasic">
                                    <th class="tdGray thfz11">TIPO CREDITO</th>
                                    <th class="tdGray thfz11">TIPO DOCUMENTO</th>
                                    <th class="tdGray thfz11">MONTO DEUDA</th>
                                    <th class="tdGray thfz11">Nº OPERACIÓN</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${dataDB3.map((item) => {
                                    flagClass = !flagClass;
                                    return `<tr class="trBasic ${flagClass ? 'trGray' : ''}">
                                                <td class="tdCenter">${item.codigo_emisor}</td>
                                                <td class="tdCenter">${item.fecha_vencimiento}</td>
                                                <td class="tdCenter">${item.emisor}</td>
                                                <td class="tdCenter">${item.moneda} (${item.moneda_simbolo})</td>
                                            </tr>
                                            <tr class="trBasic ${flagClass ? 'trGray' : ''}">
                                                <td class="tdCenter">${item.tipo_credito} (${item.tipado_credito})</td>
                                                <td class="tdCenter">${item.tipo_documento} (${item.tipado_documento})</td>
                                                <td class="tdCenter">${item.monto_deuda}</td>
                                                <td class="tdCenter">${item.nro_operacion}</td>
                                            </tr>
                                            `;
                                })}
                            </tbody>
                        </table>
                    `;
    }

    htmlDetalle2 = htmlDetalle2 + '</div>';
    htmlDetalle2 = htmlDetalle2.replace(/,/g, '');

    return htmlResumen + htmlDetalle1 + htmlDetalle2;
}

module.exports = GenerarMorosidadPdf;