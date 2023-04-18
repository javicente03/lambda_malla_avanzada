const formatAmount = (digit) => {
    // separar cada 3 digitos por puntos
    if (digit === null) {
        return '0';
    }
    return digit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

module.exports = formatAmount;