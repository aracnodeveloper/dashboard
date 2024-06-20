import { fechaString, formatearFecha } from '../global/Utils';
import EstadisticService from '../services/EstadisticService';

export const repReservaController = async function(fInicio, fFin, tipo, agrupar,unidad) {
    try {
        const params = {   
            "fecha_inicio": fechaString(formatearFecha({fecha: fInicio})),
            "fecha_fin": fechaString(formatearFecha({fecha: fFin})),
            "tipo": tipo,
            "agrupar": agrupar,
            "unidad": unidad
        };
        //console.log("🚀 ~ repReservaController ~ params:", params);

        const reservaServices = new EstadisticService();
        const resp = await reservaServices.getReporteReservas(params);
        //Sconsole.log(":::: "+mostrar);
        console.log(params);
        console.log(resp);


        if (resp && resp.estado && resp.data) {    
            return {
                datos: resp.data.datos,
                categorias: resp.data.categorias
            };
        } else {
            throw new Error("No se pudo obtener la respuesta de reporte de reservas.");
        }
    } catch (error) {
        console.error("Error en repReservaController:", error);
        return false;
    }
};



