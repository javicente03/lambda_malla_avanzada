const sqlComportamientoPenal = require("../sql/sqlComportamientoPenal");


const CleanComportamientoPenal = async (id) => {

    // Comportamiento Penal
    sqlComportamientoPenal.eliminarComportamientoPenalResumen(id);
    sqlComportamientoPenal.eliminarComportamientoPenalDetalle(id);
}

module.exports = CleanComportamientoPenal;