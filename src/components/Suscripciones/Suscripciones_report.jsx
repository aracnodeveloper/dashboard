// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { parseISO, isBefore, addDays } from 'date-fns';

const DescargarSuscripciones = ({ dateRange, filterStatus, data }) => {
    const [loading, setLoading] = useState(false);

    const getSubscriptionStatus = (dateRange) => {
        // eslint-disable-next-line react/prop-types
        const dates = dateRange.split(" - ");
        const endDate = parseISO(dates[dates.length - 1]);
        const today = new Date();
        const weekFromNow = addDays(today, 7);

        if (isBefore(endDate, today)) {
            return 'Expirada';
        } else if (isBefore(endDate, weekFromNow)) {
            return 'Por vencer';
        }
        return 'Activa';
    };

    const generarExcel = async () => {
        setLoading(true);
        try {

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Reporte Suscripciones");

            const columns = [
                { header: "ID Suscripción", key: "IdSuscripcion" },
                { header: "CI/RUC", key: "ci_ruc" },
                { header: "Cliente", key: "cliente" },
                { header: "Producto", key: "prod_suscripcion" },
                { header: "Fecha Suscripción", key: "fechaSuscripcion" },
                { header: "Estado", key: "estado" },
                { header: "Vendedor", key: "vendedor" },
                { header: "Contactos", key: "contactos" },
                { header: "Cantidad Reservas", key: "cantReservas" },
                { header: "Última Reserva", key: "ultimaReservaConfirmada" }
            ];

            const rows = data.map(item => {
                return [
                    item.IdSuscripcion,
                    item.ci_ruc,
                    item.cliente,
                    item.prod_suscripcion,
                    item.fechaSuscripcion,
                    getSubscriptionStatus(item.fechaSuscripcion),
                    item.vendedor,
                    item.contactos,
                    item.cantReservas,
                    item.ultimaReservaConfirmada
                ];
            });

            worksheet.addTable({
                name: 'SuscripcionesTable',
                ref: 'A1',
                headerRow: true,
                totalsRow: false,
                style: {
                    theme: 'TableStyleMedium2',
                    showRowStripes: true,
                },
                columns: columns.map(col => ({ name: col.header, filterButton: true })),
                rows: rows
            });

            worksheet.spliceRows(1, 0,
                [`Fecha desde: ${dateRange.from.toLocaleDateString()}`],
                [`Fecha hasta: ${dateRange.to.toLocaleDateString()}`],
                [`Estado filtrado: ${filterStatus === 'todas' ? 'Todas' : filterStatus === 'activas' ? 'Activas' : 'Inactivas'}`],
                []
            );

            worksheet.columns.forEach(column => {
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, cell => {
                    const columnLength = cell.value ? cell.value.toString().length : 10;
                    if (columnLength > maxLength) {
                        maxLength = columnLength;
                    }
                });
                column.width = maxLength < 10 ? 10 : maxLength + 2;
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });
            const fileName = `Reporte_Suscripciones_${new Date().toLocaleDateString()}.xlsx`;
            saveAs(blob, fileName);

        } catch (error) {
            console.error('Error generating Excel:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={loading ? null : generarExcel}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
            {loading ? (
                <>
                    <span className="animate-spin">⌛</span>
                    <span>Generando...</span>
                </>
            ) : (
                <>
                    <span>📥</span>
                    <span>Exportar Excel</span>
                </>
            )}
        </button>
    );
};

DescargarSuscripciones.propTypes = {
    dateRange: PropTypes.shape({
        from: PropTypes.instanceOf(Date).isRequired,
        to: PropTypes.instanceOf(Date).isRequired
    }).isRequired,
    filterStatus: PropTypes.oneOf(['todas', 'activas', 'inactivas']).isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
        IdSuscripcion: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        ci_ruc: PropTypes.string,
        cliente: PropTypes.string,
        prod_suscripcion: PropTypes.string,
        fechaSuscripcion: PropTypes.string,
        vendedor: PropTypes.string,
        contactos: PropTypes.string,
        cantReservas: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        ultimaReservaConfirmada: PropTypes.string
    })).isRequired
};

 export default DescargarSuscripciones;
