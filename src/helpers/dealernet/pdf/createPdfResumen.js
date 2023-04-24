const chromium = require('chrome-aws-lambda');
const config = require('../../../config');
const { getConnection } = require('../../../database/database');
const { obtenerDatosBasicosDB } = require('../../../sql/Data_Search');
const Header = require('./header');
const templateStart = require('./templateStart');
const moment = require('moment');
const formatAmount = require('../../../functions/formatAmount');
const { logo64 } = require('./assets');

const CreatePdfResumen = async (data, malla) => {

    const connection = await getConnection();
    const person = await obtenerDatosBasicosDB(malla.rut);
    let templstart = templateStart();
    let header = await Header(person);

    // empresas_asociadas_al_rut: 0,
    // socios_asociados_al_rut: 0,
    // delitos_asociados_al_rut: 0,
    // demandas_asociadas_al_rut: 0,
    // morosidad_asociada_al_rut: 0,
    // empresas_con_demandas: 0,
    // empresas_con_morosidad: 0,
    // socios_imputados_en_delitos: 0,
    // socios_demandados: 0,
    // socios_con_morosidad: 0,
    // persona_que_mas_se_repite: null,
    // total_delitos_bases_uaf: 0,
    // total_delitos_graves: 0,
    // total_morosidad_empresas: 0,
    // total_morosidad_socios: 0,
    // total_bancos_detectados: 0,
    // companeros_delitos: 0,
    // delitos_bases_uaf: 0,
    // delitos_graves: 0,
    // otros_delitos: 0,
    // empresas_vinculadas_al_rut: 0,
    // socios_vinculados_al_rut: 0,

    const contentPdf = `
        <img src="${logo64}" class="logo" style="width: 100px; height: 100px; margin: 0 auto; display: block;">
        <h6 class="titleSeccion">Cuadro de Resumen - Red de Investigación 360°</h6>
        <hr class="hrSeccion">
        <table class="tableBasic">
            <tbody>
                <tr class="trBasic trfz12">
                    <td>Empresas asociadas al RUT</td>
                    <td>${data.empresas_asociadas_al_rut}</td>
                </tr>
                <tr class="trBasic trfz12">
                    <td>Socios en total asociados por empresas</td>
                    <td>${data.socios_asociados_al_rut}</td>
                </tr>
                <tr class="trBasic trfz12">
                    <td>Delitos asociados al RUT</td>
                    <td>${data.delitos_asociados_al_rut}</td>
                </tr>
                <tr class="trBasic trfz12">
                    <td>Demandas asociadas al RUT</td>
                    <td>${data.demandas_asociadas_al_rut}</td>
                </tr>
                <tr class="trBasic trfz12">
                    <td>Morosidad asociada al RUT</td>
                    <td>${formatAmount(data.morosidad_asociada_al_rut)}</td>
                </tr>
                <tr class="trBasic trfz12">
                    <td></td>
                    <td></td>
                </tr>
                <tr class="trBasic trfz12">
                    <td>Empresas con demandas</td>
                    <td>${data.empresas_con_demandas}</td>
                </tr>
                <tr class="trBasic trfz12">
                    <td>Empresas con morosidad</td>
                    <td>${data.empresas_con_morosidad}</td>
                </tr>
                <tr class="trBasic trfz12">
                    <td>Socios imputados en delitos</td>
                    <td>${data.socios_imputados_en_delitos}</td>
                </tr>
                <tr class="trBasic trfz12">
                    <td>Socios demandados</td>
                    <td>${data.socios_demandados}</td>
                </tr>
                <tr class="trBasic trfz12">
                    <td>Socios con morosidad</td>
                    <td>${data.socios_con_morosidad}</td>
                </tr>
                <tr class="trBasic trfz12">
                    <td></td>
                    <td></td>
                </tr>
                <tr class="trBasic trfz12">
                    <td>Persona que más se repite</td>
                    <td>${data.persona_que_mas_se_repite}</td>
                </tr>
                <tr class="trBasic trfz12">
                    <td>Total delitos bases (UAF)</td>
                    <td>${data.total_delitos_bases_uaf}</td>
                </tr>
                <tr class="trBasic trfz12">
                    <td>Total delitos graves</td>
                    <td>${data.total_delitos_graves}</td>
                </tr>
                <tr class="trBasic trfz12">
                    <td>Total morosidad de empresas</td>
                    <td>${formatAmount(data.total_morosidad_empresas)}</td>
                </tr>
                <tr class="trBasic trfz12">
                    <td>Total morosidad de los socios</td>
                    <td>${formatAmount(data.total_morosidad_socios)}</td>
                </tr>
                <tr class="trBasic trfz12">
                    <td>Total de bancos detectados</td>
                    <td>${data.total_bancos_detectados}</td>
                </tr>
            </tbody>
        </table>
    `;

    let pdfInfo = templstart + contentPdf + `</body></html>`;

    const date = moment().format('YYYY-MM-DD HH:mm:ss')
    const fecha_actual = date.toString().split(' ')[0];
    const hora_actual = date.toString().split(' ')[1].replaceAll(':', '_');

    const link = `${config.DOMAIN}/reportes/pdf/${malla.userId}/single/${malla.data_search_userId}/Resumen_Red_${malla.id_malla_avanzada}_${fecha_actual}_${hora_actual}.pdf`;

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

    console.log('Abriendo browser')
    
    // Create a new page
    const page = await browser.newPage();
    
    // set info
    await page.setContent(pdfInfo, { waitUntil: 'domcontentloaded' });
    
    // To reflect CSS used for screens instead of print
    await page.emulateMediaType('screen');

    const fs = require('fs');

    // if (!fs.existsSync(`/mnt/public/reportes/pdf/${requestUser.id}/single/${search}/`)){
    if (!fs.existsSync(`/mnt/public/reportes/pdf/${malla.userId}/single/${malla.data_search_userId}/`)){
        console.log('creando nueva carpeta')
        await fs.mkdirSync(`/mnt/public/reportes/pdf/${malla.userId}/single/${malla.data_search_userId}/`, { recursive: true });
        console.log('carpeta creada')
    }

    let path = `/mnt/public/reportes/pdf/${malla.userId}/single/${malla.data_search_userId}/Resumen_Red_${malla.id_malla_avanzada}_${fecha_actual}_${hora_actual}.pdf`;

    // Downlaod the PDF
    const pdf = await page.pdf({
        path: path,
        margin: { top: '110px', right: '40px', bottom: '80px', left: '40px' },
        printBackground: true,
        format: 'A4',
        headerTemplate: header,
        footerTemplate: `<div></div>`,
        timeout: 900000,
        displayHeaderFooter: true
    });
    console.log('pdf creado', path)

    await browser.close();

    return link;
}

module.exports = CreatePdfResumen;