import { fechaString, formatearFecha } from '../global/Utils';
import EstadisticService from '../services/EstadisticService';

export const repCashbakController = async function(pagina) {
    try {
        const params = {  
            "cantRegistrosPorPag":10,
            "pagina":pagina           
        };

        const cashbakService = new EstadisticService();
        const resp = await cashbakService.getRepRedCashback(params);
       // console.log(":::: "+mostrar);
        console.log(params);
        console.log(resp);


        if (resp && resp.estado && resp.data) {   
            return {datos: resp.data};        
        } else {
            throw new Error("No se pudo obtener la respuesta.  Controller cashback.");
        }
    } catch (error) {
        console.error("Error en repReservaController:", error);
        return false;
    }
};

export const repCashbakDetailController = async function(idUsuario) {
    try {
        const params = {  
            "idUsuario": idUsuario
        };

        const cashbakService = new EstadisticService();
        const resp = await cashbakService.getRepRedCashbackDetail(params);
       // console.log(":::: "+mostrar);
        console.log(params);
        console.log(resp);


        if (resp && resp.estado && resp.data) {   
            return {datos: resp.data};        
        } else {
            throw new Error("No se pudo obtener la respuesta.  Controller cashbackDetail.");
        }
    } catch (error) {
        console.error("Error en repReservaController:", error);
        return false;
    }
};



