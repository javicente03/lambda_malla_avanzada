const FormatRut = (rut) => {
    let rutFirst = parseInt(rut.split('-')[0]);
    
    // separar rutFirst cada 3 digitos
    let rutFirstFormated = rutFirst.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${rutFirstFormated}-${rut.split('-')[1]}`;
}

module.exports = FormatRut;