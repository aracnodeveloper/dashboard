// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    Badge
} from '@tremor/react';
import { RiAlertLine, RiCheckLine, RiInformationLine } from '@remixicon/react';
import { parseISO, isBefore, addDays } from 'date-fns';

const columns = [
    { key: 'IdSuscripcion', label: 'IDS' },
    { key: 'ci_ruc', label: 'CI/RUC' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'prod_suscripcion', label: 'Producto' },
    { key: 'fechaSuscripcion', label: 'Fecha Suscripción' },
    { key: 'vendedor', label: 'Vendedor' },
    { key: 'contactos', label: 'Contactos' },
    { key: 'cantReservas', label: '# Reservas' },
    { key: 'ultimaReservaConfirmada', label: 'Última Reserva' }
];

const getSubscriptionStatus = (dateRange) => {
    const dates = dateRange.split(" - ");
    const endDate = parseISO(dates[dates.length - 1]);
    const today = new Date();
    const weekFromNow = addDays(today, 7);

    if (isBefore(endDate, today)) {
        return { status: 'expired', color: 'red', icon: <RiAlertLine className="h-4 w-4" /> };
    } else if (isBefore(endDate, weekFromNow)) {
        return { status: 'warning', color: 'yellow', icon: <RiInformationLine className="h-4 w-4" /> };
    }
    return { status: 'active', color: 'green', icon: <RiCheckLine className="h-4 w-4" /> };
};

const TablaSuscripciones = ({ data }) => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    {columns.map(column => (
                        <TableHeaderCell key={column.key}>{column.label}</TableHeaderCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map((item, index) => {
                    const status = getSubscriptionStatus(item.fechaSuscripcion);
                    return (
                        <TableRow key={item.IdSuscripcion || index}>
                            {columns.map(column => (
                                <TableCell key={column.key}>
                                    {column.key === 'fechaSuscripcion' ? (
                                        <div className="flex items-center gap-2">
                                            <Badge color={status.color} size="sm">
                                                {status.icon}
                                            </Badge>
                                            {item[column.key]}
                                        </div>
                                    ) : (
                                        <span className={column.key === 'cliente' ? 'font-semibold text-blue-600' : ''}>
                                            {item[column.key]}
                                        </span>
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

TablaSuscripciones.propTypes = {
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

export default TablaSuscripciones;
