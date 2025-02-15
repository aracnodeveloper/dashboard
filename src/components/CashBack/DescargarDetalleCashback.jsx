// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';


const DescargarCashbackDetalle = ({ data, usuario, totalComision }) => {
    const [loading, setLoading] = useState(false);

    const generarExcel = async () => {
        setLoading(true);
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Reporte Cashback Detalle");

            const columns = [
                { header: "Fecha", key: "fecha" },
                { header: "Cliente", key: "nombreCliente" },
                { header: "Tipo Venta", key: "tipoComision" },
                { header: "Origen Comisión", key: "nombreOtorga" },
                { header: "Comisión", key: "total" },
                { header: "Suscripción", key: "suscripcion" }
            ];

            const rows = data.map(item => {
                return [
                    item.fecha,
                    item.nombreCliente,
                    item.tipoComision === "propia" ? "VENTA PERSONAL" : "VENTA EN RED",
                    item.tipoComision === "propia" ? "-" : item.nombreOtorga,
                    parseFloat(item.total),
                    item.suscripcion
                ];
            });

            worksheet.addRow([`Reporte de Cashback - ${usuario}`]);
            worksheet.addRow([`Total Comisiones: $${totalComision}`]);
            worksheet.addRow([`Fecha de generación: ${new Date().toLocaleDateString()}`]);
            worksheet.addRow([]);

            worksheet.addTable({
                name: 'CashbackTable',
                ref: 'A5',
                headerRow: true,
                totalsRow: true,
                style: {
                    theme: 'TableStyleMedium2',
                    showRowStripes: true,
                },
                columns: columns.map(col => ({
                    name: col.header,
                    filterButton: true,
                    totalsRowFunction: col.key === 'total' ? 'sum' : 'none'
                })),
                rows: rows
            });

            worksheet.getCell('A1').font = { bold: true, size: 14 };
            worksheet.getCell('A2').font = { bold: true };
            worksheet.getCell('A3').font = { italic: true };

            const comisionColumn = worksheet.getColumn('E');
            comisionColumn.numFmt = '"$"#,##0.00';

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
            const fileName = `Reporte_Cashback_${usuario}_${new Date().toLocaleDateString()}.xlsx`;
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
            className="inline-flex items-center justify-center gap-3 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 bg-green-600 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:bg-green-800"
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

DescargarCashbackDetalle.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        fecha: PropTypes.string.isRequired,
        nombreCliente: PropTypes.string.isRequired,
        tipoComision: PropTypes.string.isRequired,
        nombreOtorga: PropTypes.string,
        total: PropTypes.string.isRequired,
        suscripcion: PropTypes.string.isRequired
    })).isRequired,
    usuario: PropTypes.string.isRequired,
    totalComision: PropTypes.number.isRequired
};

export default DescargarCashbackDetalle;
