export function formatearFecha({fecha, nombreDia=false, dia=false, mes=false, anio=false}) {
    //console.log(fecha);
    var date = fecha instanceof Date?fecha: new Date(fecha);
    
    var options = {};
    if (nombreDia) {
        options["weekday"] = 'short';
    }
    if (dia) {
        options["day"] = '2-digit';
    }
    if (mes) {
        options["month"] = 'short';
    }
    if (anio) {
        options["year"] = 'numeric';
    }

    // Convertimos la fecha a UTC ajustando la zona horaria
    var fechaUTC = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

    // Formateamos la fecha utilizando toLocaleDateString
    const formattedDate = fechaUTC.toLocaleDateString('es-ES', options);

    return formattedDate;
};
export function fechaString(fecha){
    //var fecha = "29/4/2024";
    // Separar la fecha en partes (día, mes, año)
    var partesFecha = fecha.split('/');

    // Crear un objeto Date con las partes de la fecha
    var fecha = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);

    // Obtener el año, mes y día
    var año = fecha.getFullYear();
    var mes = fecha.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por lo que sumamos 1
    var dia = fecha.getDate();

    // Formatear la fecha en AAAA-MM-DD
    var fechaFormateada = año + '-' + (mes < 10 ? '0' + mes : mes) + '-' + (dia < 10 ? '0' + dia : dia);
    return fechaFormateada;
}
