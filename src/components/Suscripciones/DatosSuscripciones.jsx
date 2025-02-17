// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import {
    Button,
    Select,
    SelectItem,
    DatePicker
} from '@tremor/react';
import { RiSearch2Line, RiAlertLine, RiCheckLine, RiInformationLine } from '@remixicon/react';
import { parseISO, isBefore } from 'date-fns';
import { repSuscripcionesController } from '../../Controllers/repSuscripcionesController';
import TablaSuscripciones from './TablaSucriptores.jsx';
import DescargarSuscripciones from "./Suscripciones_report.jsx";

const DatosSuscripciones = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [dateRange, setDateRange] = useState({
        from: new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)),
        to: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    });
    const [filterStatus, setFilterStatus] = useState('todas');
    const [error, setError] = useState('');

    const fetchData = async () => {
        if (!dateRange.from || !dateRange.to) {
            setError('Por favor seleccione ambas fechas');
            return;
        }
        setError('');
        setLoading(true);

        try {
            const result = await repSuscripcionesController(dateRange.from, dateRange.to);
            if (result?.datos) {
                setData(result.datos);
                filterData(result.datos, filterStatus);
            } else {
                setError('No se encontraron datos');
            }
        } catch (err) {
            setError('Error al obtener datos');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterData = (dataToFilter, status) => {
        if (!dataToFilter) return;

        if (status === 'todas') {
            setFilteredData(dataToFilter);
            return;
        }

        const filtered = dataToFilter.filter(item => {
            const isActive = !isBefore(parseISO(item.fechaSuscripcion.split(" - ")[1]), new Date());
            return status === 'activas' ? isActive : !isActive;
        });
        setFilteredData(filtered);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = () => {
        fetchData();
    };

    const handleStatusChange = (value) => {
        setFilterStatus(value);
        filterData(data, value);
    };

    return (
        <div className="p-6 ml-4 pl-20">
            <h2 className="text-2xl font-semibold mb-6 ml-4">Suscripciones</h2>

            <div className="flex flex-wrap gap-4 mb-6 ml-4">
                <DescargarSuscripciones
                    dateRange={dateRange}
                    filterStatus={filterStatus}
                    data={filteredData}
                />
                <div className="flex flex-col gap-2">

                    <span className="font-medium">Fecha desde</span>
                    <DatePicker
                        value={dateRange.from}
                        onValueChange={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                        placeholder="Seleccione fecha"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <span className="font-medium">Fecha hasta</span>
                    <DatePicker
                        value={dateRange.to}
                        onValueChange={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                        placeholder="Seleccione fecha"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <span className="font-medium">Estado</span>
                    <Select
                        value={filterStatus}
                        onValueChange={handleStatusChange}
                        defaultValue="todas"
                    >
                        <SelectItem value="todas">
                            <div className="flex items-center gap-2">
                                <RiInformationLine className="h-4 w-4" />
                                Todas
                            </div>
                        </SelectItem>
                        <SelectItem value="activas">
                            <div className="flex items-center gap-2">
                                <RiCheckLine className="h-4 w-4" />
                                Activas
                            </div>
                        </SelectItem>
                        <SelectItem value="inactivas">
                            <div className="flex items-center gap-2">
                                <RiAlertLine className="h-4 w-4" />
                                Inactivas
                            </div>
                        </SelectItem>
                    </Select>
                </div>
                <Button
                    variant="secondary"
                    icon={RiSearch2Line}
                    onClick={handleSearch}
                    disabled={loading}
                    className="self-end"
                >
                    {loading ? 'Cargando...' : 'Buscar'}
                </Button>
            </div>

            {error && (
                <div className="text-red-500 mb-4">{error}</div>
            )}

            <TablaSuscripciones data={filteredData} />
        </div>
    );
};

export default DatosSuscripciones;
