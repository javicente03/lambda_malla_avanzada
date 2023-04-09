const config = require("../../config");

const ConsumeSoapComportamientoPenal = async (rut) => {
    console.log('consumeComportamientoPenal', rut);
    const rutFirst = rut.split('-')[0]
    const rutLast = rut.split('-')[1]
    // const { curly } = require('node-libcurl');
    const url = config.URL_DEALERNET;
    const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:web="http://dealernet.cl/webservices/">
    <soapenv:Header />
    <soapenv:Body>
    <web:CentralDeInformacion>
    <web:ctausr>${config.USER_DEALERNET}</web:ctausr>
    <web:ctapwd>${config.PASSWORD_DEALERNET}</web:ctapwd>
    <web:input>
    <root>
    <tipocns>O</tipocns>
    <ruts>
    <rut num="${rutFirst}" dv="${rutLast}" serie="" />
    </ruts>
    <prods>
    <prod cod="3403" gls="Comportamiento Penal" />
    </prods>
    </root>
    </web:input>
    </web:CentralDeInformacion>
    </soapenv:Body>
    </soapenv:Envelope>`;
    // const { statusCode, data, headers } = await curly.post(url, {
    //     httpHeader: [
    //         'Content-Type: text/xml; charset=utf-8',
    //         'SOAPAction: "http://dealernet.cl/webservices/CentralDeInformacion"'
    //     ],
    //     postFields: xml,
    //     postFieldSize: xml.length
    // });

    const sampleHeaders = {
        'user-agent': 'sampleTest',
        'Content-Type': 'text/xml;charset=UTF-8',
        'soapAction': config.SOAP_DEALERNET,
    };
    
    const fs = require('fs');
    // switch (rut) {
    //     case '15670634-5':
    //         data = fs.readFileSync('ortegaeduardopenal.xml', 'utf8');
    //         break;
    //     case '17546853-6':
    //         data = fs.readFileSync('romeromiguelpenal.xml', 'utf8');
    //         break;
    //     case '17324250-6':
    //         data = fs.readFileSync('pazyorpenal.xml', 'utf8');
    //         break;
    //     default:
    //         const soapRequest = require('easy-soap-request');
    //         const { response } = await soapRequest({ url: url, headers: sampleHeaders, xml: xml, timeout: 500000});
    //         const { headers, body, statusCode } = response;
    //         data = body;
    //         break;
    // }

    const soapRequest = require('easy-soap-request');
    const { response } = await soapRequest({ url: url, headers: sampleHeaders, xml: xml, timeout: 500000});
    const { headers, body, statusCode } = response;

    return body;
}

module.exports = ConsumeSoapComportamientoPenal;