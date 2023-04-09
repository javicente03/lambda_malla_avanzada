const VerificadorPersonaNatural = (rut) => {
    let rutFirst = parseInt(rut.split('-')[0]);
    
    // separar rutFirst cada 3 digitos
    let rutFirstFormated = rutFirst.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Devuelve si el rut pertenece a una empresa o persona natural
    const beforeFirstPoint = rutFirstFormated.split('.')[0];
    if (parseInt(beforeFirstPoint) < 55) {
        return true
    } else {
        return false
    }
}

module.exports = VerificadorPersonaNatural;