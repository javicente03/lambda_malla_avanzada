const getMorosidades = require("../helpers/dealernet/obtenerMorosidades");
const sqlMorosidades = require("../sql/sqlMorosidades");

const GenerateBoletinMorosidades = async (data, person) => {
    // Boletin Morosidades
    await getMorosidades.ObtenerBoletinMorosidadesResumen(data, person.id_data_search)

    const bolMorosidadesDet = await getMorosidades.ObtenerBoletinMorosidadesDetalleBic(data, person.id_data_search)
    await sqlMorosidades.guardarBoletinMorosidadesDetalleDB(bolMorosidadesDet)

    const bolMorosidadesSis = await getMorosidades.ObtenerBoletinMorosidadesDetalleSis(data, person.id_data_search)
    await sqlMorosidades.guardarBoletinMorosidadesDetalleDBSis(bolMorosidadesSis)
}

module.exports = GenerateBoletinMorosidades;