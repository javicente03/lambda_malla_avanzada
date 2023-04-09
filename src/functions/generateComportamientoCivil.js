const getComportamientoCivil = require("../helpers/dealernet/obtenerComportamientoCivil");
const sqlComportamientoCivil = require("../sql/sqlComportamientoCivil");

const GenerateComportamientoCivil = async (data, person) => {
    const comportamiento = await getComportamientoCivil.ObtenerComportamientoCivilResumen(data, person.id_data_search);
    await sqlComportamientoCivil.guardarComportamientoCivilResumen(comportamiento);

    await getComportamientoCivil.ObtenerComportamientoCivilDetalle(data, person.id_data_search);
}

module.exports = GenerateComportamientoCivil;