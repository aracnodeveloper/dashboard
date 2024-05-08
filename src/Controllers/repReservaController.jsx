import { fechaString, formatearFecha } from '../global/Utils';
import EstadisticService from '../services/EstadisticService';

export const repReservaController = async function(fInicio, fFin, tipo, agrupar,mostrar,unidad) {
    try {
        const params = {           
            "fecha_inicio": fechaString(formatearFecha({fecha: fInicio})),
            "fecha_fin": fechaString(formatearFecha({fecha: fFin})),
            "tipo": tipo,
            "agrupar": agrupar,
            "unidad": unidad
        };

        const reservaServices = new EstadisticService();
        const resp = await reservaServices.getReporteReservas(params);
        console.log(":::: "+mostrar);
        console.log(params);
        console.log(resp);


        if (resp && resp.estado && resp.data) {
            const listaReservas = [];
            const TotalesPeriodo = {};
            const listadoTotales = [];
            var maximo=0;
            for (const key in resp.data.datos) {
                
                const itemReserva = {
                    date: formatearFecha({fecha: key, anio: true, mes: key.length > 4, dia: key.length > 7, nombreDia: key.length > 7}),
                    dateUnformat: key
                };

                resp.data.datos[key].forEach(element => {            
                        TotalesPeriodo[element.servicio] = (TotalesPeriodo[element.servicio] || 0) + parseInt(element[mostrar]);
                        itemReserva[element.servicio] = element[mostrar];
                        maximo = maximo<parseFloat(element[mostrar])?parseFloat(element[mostrar]):maximo;
                });
                console.log(itemReserva);
                listaReservas.push(itemReserva);
            }

            for (const key in TotalesPeriodo) {
                listadoTotales.push({
                    nombre: key,
                    total: TotalesPeriodo[key]
                });
            }

            return {
                datos: listaReservas,
                categorias: resp.data.categorias,
                totales: listadoTotales,
                maximo:maximo
            };
        } else {
            throw new Error("No se pudo obtener la respuesta de reporte de reservas.");
        }
    } catch (error) {
        console.error("Error en repReservaController:", error);
        return false;
    }
};

