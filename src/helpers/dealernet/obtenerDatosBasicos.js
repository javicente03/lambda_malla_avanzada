const obtenerDatosBasicosDealerNet = async (data, rut='') => {
    
    const DOMParser = new (require('xmldom')).DOMParser;
    const document = DOMParser.parseFromString(data);
    const dataSearch = {
        rut: '',
        name: '',
        birth_date: '',
        nationality: '',
        birth_place: '',
        gender: '',
        age: 0,
        ocupation: '',
        socioeconomic: '',
        marital_status: '',
        sons: 'No',
        spouse: '',
    }
    try {
        // let rutfalse = rut;
        dataSearch.rut = document.getElementsByTagName('rut')[0].getAttribute('num') + '-' + document.getElementsByTagName('rut')[0].getAttribute('dv');
    } catch (error){
    }
    try {
        dataSearch.name = document.getElementsByTagName('rut')[0].getAttribute('nombre');
    } catch (error) {
    }
    try {
        dataSearch.nationality = document.getElementsByTagName('nacionalidad')[0].textContent;
    } catch (error) {
    }
    try {
        dataSearch.birth_date =  document.getElementsByTagName('fch_nacimiento')[0].textContent;        
    } catch (error) {
    }
    try {
        dataSearch.birth_place = document.getElementsByTagName('nacimiento_lugar')[0].textContent;
    } catch (error) {
    }
    try {
        dataSearch.gender = document.getElementsByTagName('sexo')[0].textContent;        
    } catch (error) {
    }
    try {
        dataSearch.age = parseInt(document.getElementsByTagName('edad')[0].textContent);        
    } catch (error) {
    }
    try {
        const ocupation = document.getElementsByTagName('ocupacion')[0];
        const ocupation_name = ocupation.getElementsByTagName('profesion');
        for (let i = 0; i < ocupation_name.length; i++) {

            if (i !== (ocupation_name.length -1)) {
                dataSearch.ocupation += ocupation_name[i].textContent + ', ';
            } else {
                dataSearch.ocupation += ocupation_name[i].textContent;
            }
        }
        
    } catch (error) {
    }
    try {
        dataSearch.marital_status = document.getElementsByTagName('matrimonio_estado_civil')[0].textContent;
    } catch (error) {    
    }
    try {
        dataSearch.sons = document.getElementsByTagName('hijos')[0].textContent;
    } catch (error) {
    }
    try {
        dataSearch.spouse = document.getElementsByTagName('conyuge')[0].textContent;        
    } catch (error) {
    }
    // Perfil Socio Económico ??????

    return dataSearch;
}

module.exports = obtenerDatosBasicosDealerNet;