const chromium = require('chrome-aws-lambda');
const { getConnection } = require('../../../database/database');
const { obtenerDatosBasicosDB } = require('../../../sql/Data_Search');
const Header = require('./header');
const templateStart = require('./templateStart');
const moment = require('moment');
const GenerarMorosidadPdf = require('./GenerarMorosidadPdf');
const config = require('../../../config');

const CreatePdf = async ( id_busqueda, rut ) => {
    console.log('Iniciando la generacion de Pdf, importando libreria puppeteer');

    const connection = await getConnection();
    const dataSearch = await obtenerDatosBasicosDB(rut.rut);
    const GenerateMorosidadPdf = await GenerarMorosidadPdf(dataSearch);

    // Obtener el Data_Search_User al que este relacionado el id_busqueda
    const dataSearchUser = await connection.query(`SELECT * FROM Escaneo_Malla_Avanzada EMA
        LEFT JOIN Malla_Avanzada MA ON EMA.malla_avanzadaId = MA.id_malla_avanzada
        LEFT JOIN Data_Search_User DSU ON MA.data_search_userId = DSU.id_data_search_user
        WHERE EMA.id = ?`, [id_busqueda]);

    let templstart = templateStart();
    let header = await Header(dataSearch);

    let pdfInfo = templstart + GenerateMorosidadPdf + `</body></html>`;

    const date = moment().format('YYYY-MM-DD HH:mm:ss')
    const fecha_actual = date.toString().split(' ')[0];
    const hora_actual = date.toString().split(' ')[1].replaceAll(':', '_');

    let browser = null;

    // Create a browser instance
    // const puppeteer = require('puppeteer');
    browser = await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
    });
    // const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']});
    console.log('Abriendo browser')
    
    // Create a new page
    const page = await browser.newPage();
    
    // set info
    await page.setContent(pdfInfo, { waitUntil: 'domcontentloaded' });
    
    // To reflect CSS used for screens instead of print
    await page.emulateMediaType('screen');

    const fs = require('fs');

    // if (!fs.existsSync(`/mnt/public/reportes/pdf/${requestUser.id}/single/${search}/`)){
    if (!fs.existsSync(`/mnt/public/reportes/pdf/${dataSearchUser[0].userId}/single/${dataSearchUser[0].id_data_search_user}/`)){
        console.log('creando nueva carpeta')
        await fs.mkdirSync(`/mnt/public/reportes/pdf/${dataSearchUser[0].userId}/single/${dataSearchUser[0].id_data_search_user}/`, { recursive: true });
        console.log('carpeta creada')
    }

    // path = `/mnt/public/reportes/pdf/${requestUser.id}/single/${search}/${name}_${fecha_actual}_${hora_actual}.pdf`;
    let path = `/mnt/public/reportes/pdf/${dataSearchUser[0].userId}/single/${dataSearchUser[0].id_data_search_user}/${dataSearch.name}_${fecha_actual}_${hora_actual}.pdf`;

    // Downlaod the PDF
    const pdf = await page.pdf({
        path: path,
        margin: { top: '150px', right: '40px', bottom: '80px', left: '40px' },
        printBackground: true,
        format: 'A4',
        headerTemplate: header,
        footerTemplate: `<div style="margin: 0 auto; width: 100%; text-align: center; font-size: 9px;">
            <p style="font-size: 9px; color: black; text-align: center; margin: 0 auto; width: 100%; padding-top: 10px">Informe no válido como medio de prueba</p>
        </div>`,
        timeout: 900000,
        displayHeaderFooter: true
    });
    console.log('pdf creado', path)
    
      // Close the browser instance
    await browser.close();
    console.log('browser cerrado')
    let url = `${config.DOMAIN}/reportes/pdf/${dataSearchUser[0].userId}/single/${dataSearchUser[0].id_data_search_user}/${dataSearch.name}_${fecha_actual}_${hora_actual}.pdf`;

    await connection.query(`
        UPDATE Malla_Avanzada_Detalle SET link_morosidad = ? WHERE id_malla_avanzada_detalle = ?
    `, [url, rut.malla_avanzada_detalleId]);

    return url;
}

module.exports = CreatePdf;