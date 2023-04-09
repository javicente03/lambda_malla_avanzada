const sqlComportamientoCivil = require("../../sql/sqlComportamientoCivil");

const ObtenerComportamientoCivilResumen = async (data, id) => {
    
    const DOMParser = new (require("xmldom")).DOMParser();
    const document = DOMParser.parseFromString(data);

    let comportamientoResumen = [];

    try {
        const resumen = document.getElementsByTagName('RESUMEN')[0];
        const part = resumen.getElementsByTagName('part')[0];
        const objs = part.getElementsByTagName('d');

        for (let index = 0; index < objs.length; index++) {
            const element = objs[index];
            
            let rol = '', vigente = 0, historica = 0;

            try {
                rol = element.getElementsByTagName('GLS_CODPART')[0].textContent;
            } catch(e){}
            try {
                vigente = parseInt(element.getElementsByTagName('CNTVIG')[0].textContent);
            } catch(e){}
            try {
                historica = parseInt(element.getElementsByTagName('CNTHIS')[0].textContent);
            } catch(e){}

            comportamientoResumen.push({
                data_searchId: id,
                historica: historica,
                rol: rol,
                vigente: vigente
            })
        }
    } catch (e) {}

    return comportamientoResumen;
}

const ObtenerComportamientoCivilDetalle = async (data, id) => {
    const DOMParser = new (require("xmldom")).DOMParser();
    const document = DOMParser.parseFromString(data);
    
    try {
        const detalle = document.getElementsByTagName('result')[0];
        const objs = detalle.getElementsByTagName('DATO');

        for (let index = 0; index < objs.length; index++) {
            const element = objs[index];
            
            let comportamientoDetalle = {
                data_searchId: id,
                caratulado: '',
                estado_adm: '',
                estado_proceso: '',
                etapa: '',
                fecha: '',
                fecha_ultima: '',
                notificaciones: '',
                proceso: '',
                rit: '',
                rol: '',
                status_detailt: '',
                tribunal: '',
                participacion: '',
                ubicacion: ''
            }

            try {
                comportamientoDetalle.caratulado = element.getElementsByTagName('CARATULADO')[0].textContent;
            } catch (e) {}
            try {
                comportamientoDetalle.participacion = element.getElementsByTagName('GLS_CODPART')[0].textContent;
            } catch (e) {}
            try {
                comportamientoDetalle.estado_adm = element.getElementsByTagName('ESTADMIST')[0].textContent;
            } catch (e) {}
            try {
                comportamientoDetalle.estado_proceso = element.getElementsByTagName('ESTPROCESO')[0].textContent;
            } catch (e) {}
            try {
                comportamientoDetalle.etapa = element.getElementsByTagName('ETAPA')[0].textContent;
            } catch (e) {}
            try {
                comportamientoDetalle.fecha = element.getElementsByTagName('FECHA')[0].textContent;
            } catch (e) {}
            try {
                comportamientoDetalle.fecha_ultima = element.getElementsByTagName('FCH_ULT_HIST')[0].textContent;
            } catch (e) {}
            try {
                comportamientoDetalle.notificaciones = element.getElementsByTagName('NRO_NOTIF')[0].textContent;
            } catch (e) {}
            try {
                comportamientoDetalle.proceso = element.getElementsByTagName('PROCESO')[0].textContent;
            } catch (e) {}
            try {
                comportamientoDetalle.rit = element.getElementsByTagName('RIT')[0].textContent;
            } catch (e) {}
            try {
                comportamientoDetalle.rol = element.getElementsByTagName('ROL')[0].textContent;
            } catch (e) {}
            try {
                comportamientoDetalle.status_detailt = element.getElementsByTagName('GLOSA')[0].textContent;
            } catch (e) {}
            try {
                comportamientoDetalle.tribunal = element.getElementsByTagName('TRIBUNAL')[0].textContent;
            } catch (e) {}
            try {
                comportamientoDetalle.ubicacion = element.getElementsByTagName('UBICACION')[0].textContent;
            } catch (e) {}
            
            const resultDB = await sqlComportamientoCivil.guardarComportamientoCivilDetalle(comportamientoDetalle);
            
            if (resultDB) {

                try {    
                    const gestiones = element.getElementsByTagName('GESTIONES')[0];                
                    try {
                        const cuaderno1 = gestiones.getElementsByTagName('CUADERNOS')[0];
                        const tipo_cuaderno = {
                            comportamiento_civilDetalleId: resultDB.id_comportamiento_civil_detalle,
                            tipo_cuaderno_civil: cuaderno1.getElementsByTagName('TIPO')[0].textContent
                        }
                        const save_tipo_cuaderno = await sqlComportamientoCivil.guardarTipoCuadernoCivil(tipo_cuaderno);
                        const dataCuadernoObjs = cuaderno1.getElementsByTagName('d');
                        const cuadernosLista = await guardarCuadernos(dataCuadernoObjs, save_tipo_cuaderno.id_tipo_cuaderno_civil);
                        await sqlComportamientoCivil.guardarCuadernosCivil(cuadernosLista);
                    } catch (e) {}
    
                    try {
                        const cuaderno1 = gestiones.getElementsByTagName('CUADERNOS')[1];
                        const tipo_cuaderno = {
                            comportamiento_civilDetalleId: resultDB.id_comportamiento_civil_detalle,
                            tipo_cuaderno_civil: cuaderno1.getElementsByTagName('TIPO')[0].textContent
                        }
                        const save_tipo_cuaderno = await sqlComportamientoCivil.guardarTipoCuadernoCivil(tipo_cuaderno);
                        const dataCuadernoObjs = cuaderno1.getElementsByTagName('d');
                        const cuadernosLista = await guardarCuadernos(dataCuadernoObjs, save_tipo_cuaderno.id_tipo_cuaderno_civil);
                        await sqlComportamientoCivil.guardarCuadernosCivil(cuadernosLista);
                    } catch (e) {}
                } catch (error) {}

                // if (cuadernos.length > 0 ){
                //     let tipo_cuaderno = cuadernos[0].getElementsByTagName('TIPO')[0].textContent;
                //     const dataCuadernoObjs = cuadernos[0].getElementsByTagName('d');
                //     const cuadernosLista = await guardarCuadernos(dataCuadernoObjs, tipo_cuaderno, resultDB.id_comportamiento_civil_detalle);
                //     await sqlComportamientoCivil.guardarCuadernosCivil(cuadernosLista);
                //     if (cuadernos.length > 1) {
                //         let tipo_cuaderno = cuadernos[1].getElementsByTagName('TIPO')[0].textContent;
                //         const dataCuadernoObjs = cuadernos[1].getElementsByTagName('d');
                //         const cuadernosLista = await guardarCuadernos(dataCuadernoObjs, tipo_cuaderno, resultDB.id_comportamiento_civil_detalle);
                //         await sqlComportamientoCivil.guardarCuadernosCivil(cuadernosLista);
                //     }
                // }

                // for (let index = 0; index < cuadernos.length; index++) {
                //     const el = cuadernos[index];
                //     let tipo_cuaderno = '';

                //     try {
                //         tipo_cuaderno = el.getElementsByTagName('TIPO')[0].textContent;
                //     } catch (e) {}

                //     const dataCuadernoObjs = el.getElementsByTagName('d');

                //     const cuadernosLista = await guardarCuadernos(dataCuadernoObjs, tipo_cuaderno, resultDB.id_comportamiento_civil_detalle);
                //     await sqlComportamientoCivil.guardarCuadernosCivil(cuadernosLista);

                // }

                let litigantes = [];

                const litigantesElement = element.getElementsByTagName('litigantes')[0];
                const litigantesObjs = litigantesElement.getElementsByTagName('LIT');
                
                for (let index = 0; index < litigantesObjs.length; index++) {
                    const element = litigantesObjs[index];
                    
                    let clasificacion = '', nombre = '', participante = '', rut = '';

                    try {
                        clasificacion = element.getElementsByTagName('CLASIF')[0].textContent;
                    } catch (e) {}
                    try {
                        if (element.getElementsByTagName('CLASIF')[0].textContent === 'P' || element.getElementsByTagName('CLASIF')[0].textContent === 'p') {
                            nombre = element.getElementsByTagName('DSPNOMBRES')[0].textContent + ' ' + element.getElementsByTagName('DSPAPELLIDOS')[0].textContent                            
                        } else {
                            nombre = element.getElementsByTagName('DSPORG')[0].textContent;
                        }
                    } catch (e) {}
                    try {
                        participante = element.getElementsByTagName('GLSCODPART')[0].textContent;
                    } catch (e) {}
                    try {
                        rut = element.getElementsByTagName('RUT')[0].textContent + '-' + element.getElementsByTagName('DV')[0].textContent;
                    } catch (e) {}
                    
                    litigantes.push({
                        comportamiento_civilDetalleId: resultDB.id_comportamiento_civil_detalle,
                        clasificacion: clasificacion,
                        nombre: nombre,
                        participante: participante,
                        rut: rut
                    })
                }

                await sqlComportamientoCivil.guardarLitigantesComportamientoCivil(litigantes);
            }
        }
    } catch (e) {}

    return true;
}

const guardarCuadernos = async (dataCuadernoObjs, id) => {
    let cuadernosLista = [];
    for (let index = 0; index < dataCuadernoObjs.length; index++) {
        const elCuaderno = dataCuadernoObjs[index];

        let descripcion = '', etapa = '', fecha = '', foja = '', folio = '', tramite = '';

        try {
            descripcion = elCuaderno.getElementsByTagName('DES_TRAMITE')[0].textContent;
        } catch (e) {}
        try {
            etapa = elCuaderno.getElementsByTagName('ETAPA')[0].textContent;
        } catch (e) {}
        try {
            fecha = elCuaderno.getElementsByTagName('FEC_TRAMITE_DATE')[0].textContent;
        } catch (e) {}
        try {
            foja = elCuaderno.getElementsByTagName('FOJA')[0].textContent;
        } catch (e) {}
        try {
            folio = elCuaderno.getElementsByTagName('FOLIO')[0].textContent;
        } catch (e) {}
        try {
            tramite = elCuaderno.getElementsByTagName('TRAMITE')[0].textContent;
        } catch (e) {}
        
        cuadernosLista.push({
            tipo_cuaderno_civilId: id,
            descripcion: descripcion,
            etapa: etapa,
            fecha: fecha,
            foja: foja,
            folio: folio,
            tramite: tramite,
        })
    }

    return cuadernosLista;
}

module.exports = {
    ObtenerComportamientoCivilDetalle,
    ObtenerComportamientoCivilResumen
}