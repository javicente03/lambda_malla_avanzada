const sqlComportamientoCivil = require("../sql/sqlComportamientoCivil");

const CleanComportamientoCivil = async (id) => {
    sqlComportamientoCivil.eliminarComportamientoCivilResumen(id);
    sqlComportamientoCivil.eliminarComportamientoCivilDetalle(id);
}

module.exports = CleanComportamientoCivil;