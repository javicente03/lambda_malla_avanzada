const { ObtenerBusqueda, ObtenerRutsBusqueda, ChangeStatusBusqueda } = require("./src/sql/Malla_Avanzada");
const GeneratedConsulted = require("./src/GeneratedConsulted");
const FindProductInEscanner = require("./src/sql/Products");
const { default: axios } = require("axios");
const CreatePdf = require("./src/helpers/dealernet/pdf/CreatePdf");
const GeneratedDataMalla = require("./src/GeneratedDataMalla");
const config = require("./src/config");
const GeneratedResumen = require("./src/GeneratedResumen");

exports.handler = async (event, context) => {
// const handler = async (event) => {

    let id_process = null;
    let processPending = null;
    let type_process = 'escanner';
    let link_return = null;

    try {
        id_process = event.queryStringParameters.id;
        type_process = event.queryStringParameters.type;
    } catch (error) {
        id_process = null;
        type_process = 'escanner';
    }

    if (type_process === 'escanner') {
        if (id_process !== null) {
            processPending = await ObtenerBusqueda(id_process);
        }

        console.log('processPending', processPending)

        let productosSeleccionados = {
            morosidad: false,
            penal: false,
            demandas: false
        }

        productosSeleccionados.morosidad = await FindProductInEscanner(processPending.id, 'morosidad') ? true : false;
        productosSeleccionados.penal = await FindProductInEscanner(processPending.id, 'penal') ? true : false;
        productosSeleccionados.demandas = await FindProductInEscanner(processPending.id, 'demandas') ? true : false;

        try {
            if (processPending) {

                await ChangeStatusBusqueda(id_process, 'ejecuting');

                const rutsAConsultar = await ObtenerRutsBusqueda(processPending.id);

                for (let index = 0; index < rutsAConsultar.length; index++) {
                    const rut = rutsAConsultar[index];
                    
                    await GeneratedConsulted(processPending, rut, productosSeleccionados);

                    if (productosSeleccionados.morosidad && !rut.boolean_morosidad) {
                        await CreatePdf(processPending.id, rut);
                    }

                    await GeneratedDataMalla(processPending, rut, productosSeleccionados);
                }

                await axios.get(`${config.URL_BACKEND_EMAIL}/api/email/malla-avanzada/${processPending.malla_avanzadaId}`).then(() => {
                    console.log('Se envio el email')
                }).catch((error) => {
                    console.log('Error al enviar el email', error)
                })

                await ChangeStatusBusqueda(id_process, 'finished');

            } else {
                console.log('No hay procesos pendientes')
            }
        } catch (error) {
            await ChangeStatusBusqueda(id_process, 'error');
            console.log(error)
        }
    } else {
        console.log('No es escanner')
        link_return = await GeneratedResumen(id_process);
    }

    // // retornar la promesa para que no se cierre el lambda
    return new Promise((resolve, reject) => {
        console.log('Proceso finalizadisimo')
        resolve({
            statusCode: 200,
            body: JSON.stringify({
                message: 'Proceso finalizado',
                link: link_return
            }),
        })
    })
}

// const http = require("http");
// const host = 'localhost';
// const port = 5000;

// const requestListener = async function (req, res) {

//     res.setHeader("Content-Type", "application/json");
//     const route = req.url.split("?")[0];
//     switch (route) {
//         case "/ejecute/":
//             // obtener las querys que vienen en la url
//             let id = null;
//             let type = null;
//             try {
//                 id = req.url.split("?")[1].split("=")[1];
//                 id = id.split("&")[0];
//                 type = req.url.split("&")[1].split("=")[1];
//             } catch (error) {
//                 console.log(error)
//             }

//             const event = {
//                 queryStringParameters: {
//                     id: id,
//                     type: type
//                 }
//             }
            
//             const response = await handler(event);
//             res.writeHead(200);
//             // res.end(JSON.stringify({message:"Proceso finalizado"}));
//             res.end(response.body);
//             break
//         default:
//             res.writeHead(404);
//             res.end(JSON.stringify({error:"Resource not found"}));
//     }
// };

// const server = http.createServer(requestListener);
// server.listen(port, host, () => {
//     console.log(`Server is running on http://${host}:${port}`);
// });
