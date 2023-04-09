const sqlBolMorosidades = require("../sql/sqlMorosidades");

const CleanBoletinMorosidades = async (id) => {

    // Boletin Morosidades
    await sqlBolMorosidades.eliminarBoletinMorosidadesResumenDB(id);
    await sqlBolMorosidades.eliminarListaAnosMorosidades(id);
    await sqlBolMorosidades.eliminarBoletinMorosidadesDetalleDB(id);
    await sqlBolMorosidades.eliminarBoletinMorosidadesDetalleDBSis(id);
}

module.exports = CleanBoletinMorosidades;