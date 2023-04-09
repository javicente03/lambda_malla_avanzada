const sqlComportamientoPenal = require("../../sql/sqlComportamientoPenal");

const ObtenerComportamientoPenalResumen = async (data, id) => {
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
                vigente: vigente,
                rol: rol
            })
        }
    } catch (e){}

    return comportamientoResumen;
}

const ObtenerComportamientoPenalDetalle = async (data, id) => {
    const DOMParser = new (require("xmldom")).DOMParser();
    const document = DOMParser.parseFromString(data);

    try {
        const detalle = document.getElementsByTagName('result')[0];
        const objs = detalle.getElementsByTagName('dato');

        for (let index = 0; index < objs.length; index++) {
            const element = objs[index];
            
            let comportamientoDetalle = {
                data_searchId: id,
                estado_actual: '',
                etapa: '',
                fecha_ingreso: '',
                forma_inicio: '',
                identificacion: '',
                participacion: '',
                rit: '',
                rol: '',
                ruc: '',
                status_detailt: '',
                tipo_causa: '',
                tribunal: '',
                tribunal_origen: ''
            }

            try {
                comportamientoDetalle.estado_actual = element.getElementsByTagName('est_causa')[0].textContent;
            } catch (e) {}
            try {
                comportamientoDetalle.etapa = element.getElementsByTagName('etapa')[0].textContent;
            } catch (e) {}
            try {
                comportamientoDetalle.fecha_ingreso = element.getElementsByTagName('fch_ingreso')[0].textContent;
            } catch (e) {}
            try {
                comportamientoDetalle.forma_inicio = element.getElementsByTagName('forma_inicio')[0].textContent;
            } catch (e) {}
            try {
                comportamientoDetalle.identificacion = element.getElementsByTagName('identificacion')[0].textContent;
            } catch (e) {}
            try {
                comportamientoDetalle.participacion = element.getElementsByTagName('cod_part')[0].textContent;
            } catch (e) {}
            try {
                comportamientoDetalle.rit = element.getElementsByTagName('tipo_causa')[0].textContent + ' ' + element.getElementsByTagName('rol')[0].textContent;
            } catch (e) {}
            try {
                comportamientoDetalle.rol = element.getElementsByTagName('rol')[0].textContent;
            } catch (e) {}
            try {
                comportamientoDetalle.ruc = element.getElementsByTagName('rol_unico')[0].textContent;
            } catch (e) {}
            try {
                comportamientoDetalle.status_detailt = element.getElementsByTagName('glosa')[0].textContent;
            } catch (e) {}
            try {
                comportamientoDetalle.tipo_causa = element.getElementsByTagName('tipo_causa')[0].textContent;
            } catch (e) {}
            try {
                comportamientoDetalle.tribunal = element.getElementsByTagName('tribunal')[0].textContent;
            } catch (e) {}
            try {
                comportamientoDetalle.tribunal_origen = element.getElementsByTagName('trib_origen')[0].textContent;
            } catch (e) {}
            
            const resultDB = await sqlComportamientoPenal.guardarComportamientoPenalDetalle(comportamientoDetalle);

            if (resultDB) {
                let relaciones = [];
                
                const expediente = element.getElementsByTagName('expediente')[0];
                const norma = expediente.getElementsByTagName('norma')[0];
                const relacionesObjs = norma.getElementsByTagName('rel');

                for (let index = 0; index < relacionesObjs.length; index++) {
                    const el = relacionesObjs[index];

                    let delito = '', estado = '', fecha_cambio = '', nombre = '';
                    try {
                        delito = el.getAttribute('delito');
                    } catch (e) {}
                    try {
                        nombre = el.getAttribute('nombre');
                    } catch (e) {}
                    try {
                        estado = el.getAttribute('est_relacion');
                    } catch (e) {}
                    try {
                        fecha_cambio = el.getAttribute('fch_cam_est');
                    } catch (e) {}
                    
                    relaciones.push({
                        comportamiento_penalDetalleId: resultDB.id_comportamiento_penal_detalle,
                        delito: delito,
                        estado: estado,
                        fecha_cambio: fecha_cambio,
                        nombre: nombre
                    })
                }

                await sqlComportamientoPenal.guardarRelacionesPenalDetalle(relaciones);

                let litigantes = [];

                const litigantesElement = element.getElementsByTagName('litigantes')[0];
                const litigantesObjs = litigantesElement.getElementsByTagName('lit');

                for (let index = 0; index < litigantesObjs.length; index++) {
                    const el = litigantesObjs[index];
                    let nombre = '', situacion_liberdad = '', tipo = '';
                    
                    try {
                       nombre = el.getElementsByTagName('dspnombres')[0].textContent + el.getElementsByTagName('dspapellidos')[0].textContent; 
                    } catch (e) {}
                    try {
                        situacion_liberdad = el.getElementsByTagName('sit_lib')[0].textContent;
                    } catch (e) {}
                    try {
                        tipo = el.getElementsByTagName('tipo')[0].textContent;
                    } catch (e) {}

                    litigantes.push({
                        comportamiento_penalDetalleId: resultDB.id_comportamiento_penal_detalle,
                        nombre: nombre,
                        situacion_liberdad: situacion_liberdad,
                        tipo: tipo
                    })
                }

                await sqlComportamientoPenal.guardarLitigantesPenal(litigantes);

                let tramites = [];

                const tramitesObjs = norma.getElementsByTagName('tra');

                for (let index = 0; index < tramitesObjs.length; index++) {
                    const el = tramitesObjs[index];

                    let estado = '', fecha = '', fecha_cambio = '', observacion = '', tipo = '';

                    try {
                        estado = el.getAttribute('estado');
                    } catch (e) {}
                    try {
                        fecha = el.getAttribute('fecha');
                    } catch (e) {}
                    try {
                        fecha_cambio = el.getAttribute('fch_cam_est');
                    } catch (e) {}
                    try {
                        observacion = el.getAttribute('observacion');
                    } catch (e) {}
                    try {
                        tipo = el.getAttribute('tipo');
                    } catch (e) {}
                    
                    tramites.push({
                        comportamiento_penalDetalleId: resultDB.id_comportamiento_penal_detalle,
                        estado: estado,
                        fecha: fecha,
                        fecha_cambio: fecha_cambio,
                        observacion: observacion,
                        tipo: tipo
                    })
                }

                await sqlComportamientoPenal.guardarTramitesPenal(tramites);

                let notificaciones = [];

                const notificacionesObjs = norma.getElementsByTagName('not');

                for (let index = 0; index < notificacionesObjs.length; index++) {
                    const el = notificacionesObjs[index];

                    let estado = '', fecha_audiencia = '', fecha_realizada = '', nombre = '', tipo = '';

                    try {
                        estado = el.getAttribute('estado');
                    } catch (e) {}
                    try {
                        fecha_audiencia = el.getAttribute('fch_audiencia');
                    } catch (e) {}
                    try {
                        fecha_realizada = el.getAttribute('fch_realizado');
                    } catch (e) {}
                    try {
                        nombre = el.getAttribute('raw_nomcom');
                    } catch (e) {}
                    try {
                        tipo = el.getAttribute('tipo');
                    } catch (e) {}
                    
                    notificaciones.push({
                        comportamiento_penalDetalleId: resultDB.id_comportamiento_penal_detalle,
                        estado: estado,
                        fecha_audiencia: fecha_audiencia,
                        fecha_realizada: fecha_realizada,
                        nombre: nombre,
                        tipo: tipo
                    })
                }

                await sqlComportamientoPenal.guardarNotificacionesPenal(notificaciones);
            }
        }
    } catch (e) {}

    return true;
}

module.exports = {
    ObtenerComportamientoPenalDetalle,
    ObtenerComportamientoPenalResumen
}