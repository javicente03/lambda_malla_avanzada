const moment = require("moment");
const CleanComportamientoCivil = require("./functions/cleanComportamientoCivil");
const CleanComportamientoPenal = require("./functions/cleanComportamientoPenal");
const CleanBoletinMorosidades = require("./functions/cleanMorosidades");
const GenerateComportamientoCivil = require("./functions/generateComportamientoCivil");
const GenerateComportamientoPenal = require("./functions/generateComportamientoPenal");
const GenerateBoletinMorosidades = require("./functions/generateMorosidades");
const VerificadorPersonaNatural = require("./functions/VerificadorPersonaNatural");
const VerifyValid = require("./functions/verifyValid");
const ConsumeSoapComportamientoCivil = require("./helpers/dealernet/consumeComportamientoCivil");
const ConsumeSoapComportamientoPenal = require("./helpers/dealernet/consumeComportamientoPenal");
const ConsumeSoapMorosidades = require("./helpers/dealernet/consumeMorosidades");
const obtenerDatosBasicosDealerNet = require("./helpers/dealernet/obtenerDatosBasicos");
const { obtenerDatosBasicosDB, editarDatosBasicosSimpleDB, actualizarFechaBoletin, guardarDatosBasicosDB } = require("./sql/Data_Search");

const GeneratedConsulted = async (busqueda, rut, productosSeleccionados) => {

    console.log('productosSeleccionados', productosSeleccionados);

    const ExistPerson = await obtenerDatosBasicosDB(rut.rut);
    const fechaActual = moment().format('YYYY-MM-DD HH:mm:ss');
    let returnPerson = ExistPerson;

    if (ExistPerson) {

        let data = null;
        
        if (productosSeleccionados.morosidad && !rut.boolean_morosidad) {
            let fechaCreacionMasUnaSemana = null;
            if (ExistPerson.date_morosidades !== null) {
                fechaCreacionMasUnaSemana = moment(ExistPerson.date_morosidades).add(1, 'week').format('YYYY-MM-DD HH:mm:ss')
            }

            if (fechaCreacionMasUnaSemana === null || fechaActual > fechaCreacionMasUnaSemana) {
                
                data = await ConsumeSoapMorosidades(rut.rut);

                const validSoap = await VerifyValid(data);
                if (!validSoap.result) {
                    return false;
                }

                const dataBasic = await obtenerDatosBasicosDealerNet(data);
                await editarDatosBasicosSimpleDB(dataBasic, ExistPerson.id_data_search);

                await CleanBoletinMorosidades(ExistPerson.id_data_search);
                await GenerateBoletinMorosidades(data, ExistPerson);
                await actualizarFechaBoletin(ExistPerson.id_data_search, 'date_morosidades');
            }
        }

        if (productosSeleccionados.penal && VerificadorPersonaNatural(rut.rut) && !rut.boolean_penal) {
            let fechaCreacionMasUnaSemana = null;
            if (ExistPerson.date_comppenal !== null) {
                fechaCreacionMasUnaSemana = moment(ExistPerson.date_comppenal).add(1, 'week').format('YYYY-MM-DD HH:mm:ss')
            }
            
            if (fechaCreacionMasUnaSemana === null || fechaActual > fechaCreacionMasUnaSemana) {
                
                data = await ConsumeSoapComportamientoPenal(rut.rut);

                const validSoap = await VerifyValid(data);
                if (!validSoap.result) {
                    return false;
                }

                const dataBasic = await obtenerDatosBasicosDealerNet(data);
                await editarDatosBasicosSimpleDB(dataBasic, ExistPerson.id_data_search);

                await CleanComportamientoPenal(ExistPerson.id_data_search);
                await GenerateComportamientoPenal(data, ExistPerson);
                await actualizarFechaBoletin(ExistPerson.id_data_search, 'date_comppenal');
            }
        }

        if (productosSeleccionados.demandas && !rut.boolean_demandas) {
            let fechaCreacionMasUnaSemana = null;
            if (ExistPerson.date_compcivil !== null) {
                fechaCreacionMasUnaSemana = moment(ExistPerson.date_compcivil).add(1, 'week').format('YYYY-MM-DD HH:mm:ss')
            }

            if (fechaCreacionMasUnaSemana === null || fechaActual > fechaCreacionMasUnaSemana) {
                
                data = await ConsumeSoapComportamientoCivil(rut.rut);

                const validSoap = await VerifyValid(data);
                if (!validSoap.result) {
                    return false;
                }

                const dataBasic = await obtenerDatosBasicosDealerNet(data);
                await editarDatosBasicosSimpleDB(dataBasic, ExistPerson.id_data_search);

                await CleanComportamientoCivil(ExistPerson.id_data_search);
                await GenerateComportamientoCivil(data, ExistPerson);
                await actualizarFechaBoletin(ExistPerson.id_data_search, 'date_compcivil');
            }
        }

    } else {

        console.log('--------------------------------------')
        console.log('No existe persona')
        console.log('--------------------------------------')

        if (productosSeleccionados.morosidad && !rut.boolean_morosidad) {
            const data = await ConsumeSoapMorosidades(rut.rut);
            const validSoap = await VerifyValid(data);
            if (!validSoap.result) {
                return false;
            }

            const dataBasic = await obtenerDatosBasicosDealerNet(data);
            
            let newPerson = null;
            const existPerson = await obtenerDatosBasicosDB(dataBasic.rut);

            // Revisa si ya el usuario se registro (No existia) en los pasos anterior (si tambien fueron seleccionados)
            if (!existPerson) {
                newPerson = await guardarDatosBasicosDB(dataBasic);                
            } else {
                newPerson = await editarDatosBasicosSimpleDB(dataBasic, existPerson.id_data_search);
            }
            
            await CleanBoletinMorosidades(newPerson.id_data_search);
            await GenerateBoletinMorosidades(data, newPerson);
            await actualizarFechaBoletin(newPerson.id_data_search, 'date_morosidades');
            returnPerson = newPerson;
        }

        if (productosSeleccionados.penal && VerificadorPersonaNatural(rut.rut) && !rut.boolean_penal) {
            const data = await ConsumeSoapComportamientoPenal(rut.rut);
            const validSoap = await VerifyValid(data);
            if (!validSoap.result) {
                return false;
            }

            const dataBasic = await obtenerDatosBasicosDealerNet(data);
            
            let newPerson = null;
            const existPerson = await obtenerDatosBasicosDB(dataBasic.rut);

            // Revisa si ya el usuario se registro (No existia) en los pasos anterior (si tambien fueron seleccionados)
            if (!existPerson) {
                newPerson = await guardarDatosBasicosDB(dataBasic);                
            } else {
                newPerson = await editarDatosBasicosSimpleDB(dataBasic, existPerson.id_data_search);
            }
            
            await CleanComportamientoPenal(newPerson.id_data_search);
            await GenerateComportamientoPenal(data, newPerson);
            await actualizarFechaBoletin(newPerson.id_data_search, 'date_comppenal');
            returnPerson = newPerson;
        }

        if (productosSeleccionados.demandas && !rut.boolean_demandas) {
            const data = await ConsumeSoapComportamientoCivil(rut.rut);
            const validSoap = await VerifyValid(data);
            if (!validSoap.result) {
                return false;
            }

            const dataBasic = await obtenerDatosBasicosDealerNet(data);
            
            let newPerson = null;
            const existPerson = await obtenerDatosBasicosDB(dataBasic.rut);

            // Revisa si ya el usuario se registro (No existia) en los pasos anterior (si tambien fueron seleccionados)
            if (!existPerson) {
                newPerson = await guardarDatosBasicosDB(dataBasic);                
            } else {
                newPerson = await editarDatosBasicosSimpleDB(dataBasic, existPerson.id_data_search);
            }
            
            await CleanComportamientoCivil(newPerson.id_data_search);
            await GenerateComportamientoCivil(data, newPerson);
            await actualizarFechaBoletin(newPerson.id_data_search, 'date_compcivil');
            returnPerson = newPerson;
        }
    }

    if (returnPerson === null) {
        console.log('NO EXISTE EN LA BASE DE DATOS 2');
        return {error: "No se encontró el rut", status: 404, result: false}
    }

    return { result: true, person: returnPerson};
}

module.exports = GeneratedConsulted;