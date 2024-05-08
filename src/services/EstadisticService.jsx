import Config from "../global/config";
import GenericService from "./service";

class EstadisticServices extends GenericService{

    async getReporteReservas(params){
        const url = `${Config.URL_SERVICIOS}${Config.VERREP}getReporteReservas/`;
        return await this.post(url, params);
    }
    async getReporteCuentasGratis(params){
        const url = `${Config.URL_SERVICIOS}${Config.VERREP}getReporteCuentasGratis/`;
        return await this.post(url, params);
    }

}
export default EstadisticServices;