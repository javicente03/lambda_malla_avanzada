const VerifyValid = async (data) => {
    const DOMParser = new (require("xmldom")).DOMParser();
    const document = DOMParser.parseFromString(data);
    let retcode = '';
    try {
        retcode = document.getElementsByTagName('retcode')[0].textContent;
    } catch (e) {
        return {result: false, message: 'El rut ingresado es inválido'};
    }

    if (retcode !== '0') {
        return {result: false, message: 'El rut ingresado es inválido'};
    }

    let name = '';
    try {
        name = document.getElementsByTagName('rut')[0].getAttribute('nombre');
    } catch (error) {
    }

    if(name==='Sin Nombre' || name===''){
        return {result: false, message: 'El rut ingresado no fue encontrado'};
    }

    return {result: true, message: ''};
}

module.exports = VerifyValid;