const templateStart = () => {
    const header = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: Arial, Helvetica, sans-serif;
                word-break: keep-all;
            }

            .noInfo {
                text-align: right;
                font-size: 12px;
                color: #930000 !important;
            }
    
            #pageHeader {
                padding: 0;
            }
    
            .titleName {
                color: #f4802d;
            }
    
            .titleRut {
                font-weight: bold;
                font-size: 14px;
            }
            
            .titleBoletin {
                text-align: center;
                width: 90%;
                margin: 0 auto;
                padding: 5px;
                background-color: #1f497d;
                color: white;
                font-weight: bold;
                margin-top: 10px;
            }

            .titleFont td {
                font-weight: bold;
                font-size: 14px !important;
            }

            .titleFont span {
                font-weight: normal;
                font-size: 14px !important;
            }
    
            .tableBasic {
                width: 80%;
                margin: 0 auto;
                margin-top: 30px;
                border-collapse: collapse;
                /* border: #385d8a 1px solid; */
            }

            .tableSingle {
                width: 100%;
            }

            .tableSingle td {
                padding: 5px;
            }
    
            tbody * {
                font-size: 12px !important;
            }
    
            thead tr * {
                text-transform: uppercase;
            }
    
            .trBasic * {
                font-size: 12px;
            }

            .trBorderSingle {
                border: #385d8a 1px solid;
            }
    
            .trBasic td, .trBasic th {
                padding: 5px;
                border: #385d8a 1px solid;
            }

            tbody tr {
                background-color: #dce6f2;
            }

            .trGray {
                background-color: #b9cde5 !important;
            }

            .thfz11 {
                font-size: 9px !important;
            }
    
            .trfz12 {
                font-size: 12px;
            }

            .fz14 {
                font-size: 14px;
            }

            .fwBold {
                font-weight: bold;
            }
    
            .tdGray {
                background-color: #b9cde5 !important;
                font-weight: bold;
            }
    
            .tdColorGreen {
                color: #27a645;
            }
    
            .tdColorRed {
                color: #dc3545;
            }
    
            .tdCenter {
                text-align: center;
            }
    
            .tdRight {
                text-align: right;
            }
    
            .tdNone {
                border: none !important;
                background-color: white !important;
            }
    
            .tdw100 {
                width: 100%;
            }
    
            .tdw95 {
                width: 95%;
            }
    
            .tdw90 {
                width: 90%;
            }
    
            .tdw80 {
                width: 80%;
            }
    
            .tdw75 {
                width: 75%;
            }
    
            .tdw70 {
                width: 70%;
            }
    
            .tdw65 {
                width: 65%;
            }
    
            .tdw60 {
                width: 60%;
            }
    
            .tdw55 {
                width: 55%;
            }
    
            .tdw50 {
                width: 50%;
            }
    
            .tdw45 {
                width: 45%;
            }
    
            .tdw40 {
                width: 40%;
            }
    
            .tdw35 {
                width: 35%;
            }
    
            .tdw30 {
                width: 30%;
            }
    
            .tdw25 {
                width: 25%;
            }
    
            .tdw20 {
                width: 20%;
            }
    
            .tdw15 {
                width: 15%;
            }
    
            .tdw10 {
                width: 10%;
            }
    
            .tdw5 {
                width: 5%;
            }

            .page_break {
                page-break-before: always;
            }  
    
            .titleSeccion {
                width: 95%;
                margin: 0 auto;
                margin-top: 20px;
                font-size: 16px;
                font-weight: bold;
                color: #1f497d;
            }
    
            .identification {
                width: 90%;
                margin: 0 auto;
                margin-top: 20px;
            }

            .hrSeccion {
                color: #f6f6f6e1;
                box-shadow: 1.5px 1.5px 1.5px #d0d0d0;
                width: 250px;
                margin-left: 5px;
            }

            .hrBlue {
                color: red;
                width: 90%;
                margin: 0 auto;
            }
    
            .hrFull {
                color: #f6f6f6e1;
                box-shadow: 3px 3px 3px #d0d0d0;
                margin: 0 auto;
                width: 80%;
            }

            .divInfoComp {
                width: 90%;
                margin: 0 auto;
            }

            .dpflex {
                display: flex;
                flex-wrap: nowrap;
                width: 100%;
            }

            .dpspbtween {
                justify-content: space-between;
            }

            .dpsparround {
                justify-content: space-around;
            }

            .dpspcenter {
                justify-content: center;
            }
    
            .divInfoSingle {
                margin: 0 auto;
                margin-top: 30px;
                width: 80%;
            }
    
            .infoSingle {
                margin-top: 10px;
            }
    
            .infoSingle > * {
                display: block;
                margin-top: 5px;
                font-size: 12px;
            }
    
            .colorBlueAlb {
                color: #4bacc6;
            }
            .colorBlack {
                color: #4f81bd;
            }
    
            .colorBluer {
                color: #1f497d;
            }
    
            .fz11 {
                font-size: 11px;
                margin: 0;
                font-weight: 600;
            }
    
            .spanBlock {
                display: block;
                margin: 0 auto;           
            }
    
            .mg0a {
                margin: 0 auto;
                margin-top: 5px;
            }
    
            .justify {
                text-align: justify;
            }

            table.print-friendly tr td, table.print-friendly tr th {
                page-break-inside: avoid;
            }

            .containerPortada {
                width: 85%;
                border-radius: 10px;
                display: flex;
                flex-wrap: wrap;
                background-color: #dce6f2;
                margin: 0 auto;
                border: #385d8a 3px solid;
                margin-top: 15px;
            }
    
            .perfilPortada {
                width: 30%;
                background-color: #b9cde5;
                border-radius: 10px;
                border-right: #6b87aa 3px solid;
            }

            .contenedorPortada {
                background-color: red !important;
            }
    
            .iconPortada {
                width: 100%;
                text-align: center;
            }
    
            .iconPortada img {
                width: 50%;
            }
    
            .imgPortada {
                width: 100%;
                text-align: center;
            }
    
            .imgPortada img {
                width: 50%;
                border: #385d8a 3px solid;
                border-radius: 50%;
            }
    
            .namePortada {
                width: 100%;
                text-align: center;
                color: #1f497d;
            }
    
            .namePortada h5{
                font-size: 12px;
                width: 80%;
                margin: 0 auto;
                font-weight: bold;
                margin-bottom: 5px;
            }
    
            .namePortada span {
                display: block;
                font-size: 11px;
                margin-top: 2px;
            }
    
            .infoPerfilPortada {
                width: 90%;
                background-color: #4f81bd;
                border: #416a9b 2px solid;
                margin: 0 auto;
                box-sizing: border-box;
                border-radius: 10px;
                margin-top: 5px;
                margin-bottom: 5px;
                display: flex;
                flex-wrap: wrap;
            }
    
            .infoPerfilPortada a {
                display: block;
                color: #fff;
                font-size: 12px;
                font-weight: normal;
                text-decoration: underline;
                text-transform: lowercase;
                margin-left: 2px;
            }
    
            .infoPerfilPortada .img {
                width: 20%;
            }
    
            .img img {
                width: 20px;
                margin-left: -5px;
            }
    
            .enlacePortada {
                width: 80%;
                padding-top: 5px;
                padding-bottom: 5px;
            }
    
    
            .detallePortada {
                background-color: transparent;
                width: 68%;
                margin: 0 auto;
                display: flex;
                flex-wrap: wrap;
            }
    
            .riesgos {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                padding: 10px;
                align-self: flex-start;
            }
    
            .riesgoPenal {
                width: 45%;
                background-color: #ffffff;
                padding: 2px 5px;
                color: #1f497d;
                border: #58789e 2px solid;
                border-radius: 10px;
                font-weight: bold;
            }
    
            .riesgoPenal img {
                width: 20px;
            }
    
            .riesgoPenal div {
                display: flex;
                justify-content: space-around;
            }
    
            .riesgoPenal h6 {
                text-align: center;
            }
    
            .riesgoPenal div span {
                margin-top: 10px;
            }
    
            .perfilPenalPortada {
                width: 100%;
                background-color: #ffffff;
                border-radius: 10px;
                border: #58789e 2px solid;
                margin-top: 5px;
                color: #1f497d;
                text-align: center;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                padding: 5px;
                box-sizing: border-box;
            }
    
            .perfilPenalPortada h6 {
                width: 100%;
            }
    
            .perfilPenalPortada > div {
                width: 30%;
                border: #58789e 2px solid;
                border-radius: 20px;
                padding: 3px;
                box-shadow: 1px 1px 3px #232323;
            }
    
            .perfilPenalPortada > div > img {
                width: 20px;
            }
    
            .perfilPenalPortada > div > span {
                display: block;
                font-size: 12px;
                color: #fff;
                font-weight: bold;
            }
    
            .perfilPenalPortada > div > a {
                display: block;
                font-size: 9px;
                color: #fff;
                font-weight: normal;
                text-decoration: underline;
            }
    
            .imgIcon {
                width: 100%;
                text-align: left;
            }
    
            .imgIcon img {
                width: 20px;
            }
    
            .spanTime {
                font-size: 9px !important;
                font-weight: normal !important;
            }
    
            span.caracter {
                font-size: 22px;
                margin-right: 2px;
                font-weight: bold;
            }
    
            .perfilPenal1 {
                background-color: #4f81bd;
                box-sizing: border-box;
            }
    
            .perfilPenal2 {
                background-color: #4bacc6;
                box-sizing: border-box;
            }
    
            .mg-10 {
                width: 80%;
                margin: 0 auto;
                margin-top: 0px;
                margin-top: -10px;
            }
    
            .perfilPenal3 {
                background-color: #4f81bd;
            }
    
            .perfilComercialPortada {
                width: 100%;
                background-color: #ffffff;
                border-radius: 10px;
                border: #58789e 2px solid;
                margin-top: 5px;
                color: #1f497d;
                text-align: center;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                padding: 5px;
                box-sizing: border-box;
            }
    
            .perfilComercialPortada h6 {
                width: 100%;
            }
    
            .perfilComercial1 {
                background-color: #4bacc6;
                box-sizing: border-box;
            }
    
            .perfilComercial2 {
                background-color: #4f81bd;
                box-sizing: border-box;
            }
    
            .perfilComercial3 {
                background-color: #4bacc6;
                box-sizing: border-box;
            }
    
            .perfilComercial4 {
                background-color: #4f81bd;
                box-sizing: border-box;
                margin-top: 5px;
            }

            .perfilComercial5 {
                background-color: #4bacc6;
                box-sizing: border-box;
                margin-top: 5px;
            }
    
            .perfilComercial6 {
                background-color: #1f497d;
                box-sizing: border-box;
                margin-top: 5px;
            }
    
            .perfilComercialPortada > div {
                width: 30%;
                border: #58789e 2px solid;
                border-radius: 20px;
                padding: 3px;
                box-shadow: 1px 1px 3px #232323;
            }
    
            .perfilComercialPortada > div > img {
                width: 20px;
            }
    
            .perfilComercialPortada > div > span {
                display: block;
                font-size: 12px;
                color: #fff;
                font-weight: bold;
            }
    
            .perfilComercialPortada > div > a {
                display: block;
                font-size: 9px;
                color: #fff;
                font-weight: normal;
                text-decoration: underline;
            }
    
            span.n-a {
                color: #880000 !important;
                font-size: 9px !important;
                display: block !important;
                background-color: #ffffff92 !important;
                padding: 2px !important;
                margin-top: 10px !important;
                border-radius: 10px !important;
                border: #880000 1px solid !important;
                font-weight: bold !important;
                text-align: center !important;
            }

            .sp11 {
                font-size: 11px !important;
            }
        </style>
    </head>
    
    <body>
    `

    return header;
}

module.exports = templateStart;