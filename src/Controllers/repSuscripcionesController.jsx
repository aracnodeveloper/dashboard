import { fechaString, formatearFecha } from '../global/Utils';
import EstadisticService from '../services/EstadisticService';

export const repSuscripcionesController = async function(fInicio, fFin) {
    try {
        const params = {           
            "fecha_inicio": fechaString(formatearFecha({fecha: fInicio})),
            "fecha_fin": fechaString(formatearFecha({fecha: fFin}))           
        };

        const suscripcionesServices = new EstadisticService();
        const resp = await suscripcionesServices.getRepSuscripciones(params);
       // console.log(":::: "+mostrar);
        console.log(params);
        console.log(resp);


        if (resp && resp.estado && resp.data) {   
            return {datos: resp.data};        
        } else {
            throw new Error("No se pudo obtener la respuesta de reporte de reservas.");
        }
    } catch (error) {
        console.error("Error en repReservaController:", error);
        return false;
    }
};

