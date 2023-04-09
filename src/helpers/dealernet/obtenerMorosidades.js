const sqlMorosidades = require("../../sql/sqlMorosidades");

const ObtenerBoletinMorosidadesResumen = async (data, id) => {
    const DOMParser = new (require("xmldom")).DOMParser();
    const document = DOMParser.parseFromString(data);
    let boletin_morosidades = null;
    try {

        boletin_morosidades = document.getElementsByTagName('BOLETINCCSWS')[0];

        const indice = boletin_morosidades.getElementsByTagName('total')[0];
        const elementos_indice = indice.getElementsByTagName('d')

        for (let index = 0; index < elementos_indice.length; index++) {
            let bolMorosidades = {
                cantidad: 0,
                tipo_morosidad: '',
                data_searchId: id
            }

            const element = elementos_indice[index];
            try {
                bolMorosidades.tipo_morosidad = element.getAttribute('glosa');                
            } catch (e) {}
            try {
                bolMorosidades.cantidad = parseInt(element.getAttribute('c'))
            } catch (e) {}

            const boletinMorosidades = await sqlMorosidades.guardarBoletinMorosidadesResumenDB(bolMorosidades);
            
            if (boletinMorosidades) {
                const forYear = boletin_morosidades.getElementsByTagName('indice')[0]
                let bolMorosidadesResYear = [];

                const elementos_year = forYear.getElementsByTagName('d')[index];
                const year = elementos_year.getElementsByTagName('a');
                for (let j = 0; j < year.length; j++) {
                    
                    bolMorosidadesResYear.push({
                        cantidad: parseInt(year[j].getAttribute('valor')),
                        year: year[j].getAttribute('n'),
                        morosidades_resumenId: boletinMorosidades.id_morosidades_resumen
                    })
                }
                
                await sqlMorosidades.guardarBoletinMorosidadesResumenYearDB(bolMorosidadesResYear);
            }
        }

        const totalano = boletin_morosidades.getElementsByTagName('totalano')[0];
        const totalanoArray = totalano.getElementsByTagName('d');
        let yearsArray = [];

        for (let index = 0; index < totalanoArray.length; index++) {
            const elemento = totalanoArray[index];
            let year_element = '', total_year= 0;

            try {
                year_element = elemento.getAttribute('a');
            } catch (e) {}
            try {
                total_year = parseInt(elemento.getAttribute('c'));
            } catch (e) {}
            yearsArray.push({
                year: year_element,
                cantidad: total_year,
                data_searchId: id
            })
        }

        await sqlMorosidades.guardarListaAnosMorosidades(yearsArray);
    } catch (e) {
    }

    return true;
}

const ObtenerBoletinMorosidadesDetalleBic = async (data, id) => {
    const DOMParser = new (require("xmldom")).DOMParser();
    const document = DOMParser.parseFromString(data);
    
    let bolMorosidadesDet = [];
    let boletin_morosidades = null;
    try {
        
        boletin_morosidades = document.getElementsByTagName('BOLETINCCSWS')[0];
        
        const detalles = boletin_morosidades.getElementsByTagName('bic');

        // codigo_emisor   String   @db.VarChar(255)
        // fecha_protesto  String   @db.VarChar(255)
        // fecha_publicacion String   @db.VarChar(255)
        // fecha_vencimiento String   @db.VarChar(255)
        // emisor          String   @db.VarChar(255)
        // moneda          String   @db.VarChar(255)
        // moneda_simbolo  String   @db.VarChar(255)
        // tipo_documento  String   @db.VarChar(255)
        // tipado_documento String   @db.VarChar(10) @default("CM")
        // tipo_documento_impago String   @db.VarChar(255)
        // tipado_documento_impago String   @db.VarChar(10) @default("DH")
        // tipo_emisor     String   @db.VarChar(255)
        // tipado_emisor   String   @db.VarChar(10) @default("BCO")
        // localidad_publicacion String   @db.VarChar(255)
        // monto_deuda     Int
        // nombre_librador String   @db.VarChar(255)
        // nro_boletin     String   @db.VarChar(255)
        // nro_operacion   String   @db.VarChar(255)
        // pago_boletin    String   @db.VarChar(255)

        for (let index = 0; index < detalles.length; index++) {
            const detalle = detalles[index];

            let codigo_emisor = '', fecha_protesto = '', fecha_publicacion = '', fecha_vencimiento = '',
                emisor = '', moneda = '', moneda_simbolo = '', tipo_documento = '', tipo_documento_impago = '', tipado_emisor = '', pago_boletin = '',
                tipo_emisor = '', localidad_publicacion = '', monto_deuda = 0, nombre_librador = '', nro_boletin = '', nro_operacion = '',
                tipado_documento = '', tipado_documento_impago = '';

            try {
                codigo_emisor = detalle.getAttribute('codigoemisor');
            } catch (e) {}
            try {
                fecha_protesto = detalle.getAttribute('fechaprotesto');
            } catch (e) {}
            try {
                fecha_publicacion = detalle.getAttribute('fechapublicacion');
            } catch (e) {}
            try {
                fecha_vencimiento = detalle.getAttribute('fechavencimiento');
            } catch (e) {}
            try {
                emisor = detalle.getAttribute('glosaemisor');
            } catch (e) {}
            try {
                moneda = detalle.getAttribute('glosamoneda');
            } catch (e) {}
            try {
                moneda_simbolo = detalle.getAttribute('glosacortamoneda');
            } catch (e) {}
            try {
                tipo_documento = detalle.getAttribute('glosatipodocumento');
            } catch (e) {}
            try {
                tipo_documento_impago = detalle.getAttribute('glosatipodocumentoimpago');
            } catch (e) {}
            try {
                tipo_emisor = detalle.getAttribute('glosatipoemisor');
            } catch (e) {}
            try {
                localidad_publicacion = detalle.getAttribute('localidadpublicacion');
            } catch (e) {}
            try {
                monto_deuda = detalle.getAttribute('montodeuda');
            } catch (e) {}
            try {
                nombre_librador = detalle.getAttribute('nombrelibrador');
            } catch (e) {}
            try {
                nro_boletin = detalle.getAttribute('nroboletin');
            } catch (e) {}
            try {
                nro_operacion = detalle.getAttribute('nrooperacion');
            } catch (e) {}
            try {
                tipado_emisor = detalle.getAttribute('tipoemisor');
            } catch (e) {}
            try {
                pago_boletin = detalle.getAttribute('pagboletin');
            } catch (e) {}
            try {
                tipado_documento = detalle.getAttribute('tipodocumento');
            } catch (e) {}
            try {
                tipado_documento_impago = detalle.getAttribute('tipodocumentoimpago');
            } catch (e) {}

            bolMorosidadesDet.push({
                codigo_emisor,
                fecha_protesto,
                fecha_publicacion,
                fecha_vencimiento,
                emisor,
                moneda,
                moneda_simbolo,
                tipo_documento,
                tipo_documento_impago,
                tipo_emisor,
                localidad_publicacion,
                monto_deuda,
                nombre_librador,
                nro_boletin,
                nro_operacion,
                tipado_emisor,
                pago_boletin,
                tipado_documento,
                tipado_documento_impago,
                data_searchId: id
            });
        }

    } catch (e) {
    }

    return bolMorosidadesDet;
}

const ObtenerBoletinMorosidadesDetalleSis = async (data, id) => {
    const DOMParser = new (require("xmldom")).DOMParser();
    const document = DOMParser.parseFromString(data);
    
    let bolMorosidadesDet = [];
    let boletin_morosidades = null;
    try {
        
        boletin_morosidades = document.getElementsByTagName('BOLETINCCSWS')[0];

        const detalles = boletin_morosidades.getElementsByTagName('mol');

        // codigo_emisor   String   @db.VarChar(255)
        // fecha_vencimiento String   @db.VarChar(255)
        // emisor          String   @db.VarChar(255)
        // moneda          String   @db.VarChar(255)
        // moneda_simbolo  String   @db.VarChar(255) @default("$")
        // tipo_credito    String   @db.VarChar(255)
        // tipado_credito  String   @db.VarChar(10) @default("DH")
        // tipo_documento  String   @db.VarChar(255)
        // tipado_documento String   @db.VarChar(10) @default("CM")
        // monto_deuda     Int
        // nro_operacion   String   @db.VarChar(255)

        for (let index = 0; index < detalles.length; index++) {
            const detalle = detalles[index];

            let codigo_emisor = '', fecha_vencimiento = '', emisor = '', moneda = '', tipo_credito = '', tipo_documento = '', monto_deuda = 0, nro_operacion = '',
                tipado_credito = '', moneda_simbolo = '', tipado_documento = '';

            try {
                codigo_emisor = detalle.getAttribute('codigoEmisor');
            } catch (e) {}
            try {
                fecha_vencimiento = detalle.getAttribute('fechaVencimiento');
            } catch (e) {}
            try {
                emisor = detalle.getAttribute('glosaEmisor');
            } catch (e) {}
            try {
                moneda = detalle.getAttribute('glosaMoneda');
            } catch (e) {}
            try {
                tipo_credito = detalle.getAttribute('glosaTipoCredito');
            } catch (e) {}
            try {
                tipo_documento = detalle.getAttribute('glosaTipoDocumento');
            } catch (e) {}
            try {
                monto_deuda = detalle.getAttribute('montoDeuda');
            } catch (e) {}
            try {
                nro_operacion = detalle.getAttribute('nroOperacion');
            } catch (e) {}
            try {
                tipado_credito = detalle.getAttribute('tipoCredito');
            } catch (e) {}
            try {
                moneda_simbolo = detalle.getAttribute('glosaCortaMoneda');
            } catch (e) {}
            try {
                tipado_documento = detalle.getAttribute('tipoDocumento');
            } catch (e) {}

            bolMorosidadesDet.push({
                codigo_emisor,
                fecha_vencimiento,
                emisor,
                moneda,
                tipo_credito,
                tipo_documento,
                monto_deuda,
                nro_operacion,
                tipado_credito,
                moneda_simbolo,
                tipado_documento,
                data_searchId: id
            });
        }

    } catch (e) {
    }

    return bolMorosidadesDet;
}

module.exports = {
    ObtenerBoletinMorosidadesDetalleBic,
    ObtenerBoletinMorosidadesResumen,
    ObtenerBoletinMorosidadesDetalleSis
}