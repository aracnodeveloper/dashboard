// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { repCashbakController, repCashbakDetailController } from '../../Controllers/repCashbackController';
// eslint-disable-next-line no-unused-vars
import ReactPaginate from 'react-paginate';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Divider } from '@tremor/react';
import Paginacion from './Paginacion';
import DescargarCashbackDetalle from "./DescargarDetalleCashback.jsx";

const GraficaCashback = () => {
    const [tableData, setTableData] = useState([]);
    const [pageCount] = useState(8);
    const [currentPage, setCurrentPage] = useState(0);
    const [tableDetail, setTableDetail] = useState([]);
    const [usuarioDetalle, setUsuarioDetalle] = useState();
    const [hoveredItemIndex, setHoveredItemIndex] = useState(null);
    const [currentPageDetail, setCurrentPageDetail] = useState(0);

    const handlePageDetailClick = ({ selected }) => {
        setCurrentPageDetail(selected);
    };

    const ITEMS_PER_PAGE = 10;
    const offset = currentPageDetail * ITEMS_PER_PAGE;
    const currentItems = tableDetail.slice(offset, offset + ITEMS_PER_PAGE);

    const fetchData = (page) => {
        repCashbakController(page).then((result) => {
            if (result) {
                console.log(result.datos);
                setTableData(result.datos);
            }
        });
    };

    const fetchDetail = (idUsuario) => {
        repCashbakDetailController(idUsuario).then((result) => {
            if (result) {
                console.log(result.datos);
                setTableDetail(result.datos);
            }
        });
    }

    useEffect(() => {
        console.log("Fetching data for page " + currentPage);
        fetchData(currentPage);
    }, [currentPage]);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const handleClickDetalle = (id, usuario) => {
        console.log(id);
        setCurrentPageDetail(0);
        setUsuarioDetalle(usuario);
        fetchDetail(id);
    }

    const totalComision = parseFloat(
        tableDetail.reduce((sum, item) => sum + parseFloat(item.total || 0), 0).toFixed(2)
    );

    return (
        <div className="flex flex-col w-full h-screen bg-gray-50">
            <span className="font-semibold text-2xl text-gray-800 ml-8 mt-4 mb-2">
                Cashback
            </span>

            <div className="flex flex-col md:flex-row px-4 md:px-6 py-4 gap-6 w-full h-[calc(100vh-100px)]">

                <div className="w-full md:w-1/2 border bg-white shadow-lg rounded-lg p-6 flex flex-col h-full">
                    <div className="mb-4">
                        <label className="font-semibold text-lg text-gray-700 ml-3">
                            Lista de totales de cashback
                        </label>
                        <Divider />
                    </div>

                    <div className="flex-1 overflow-auto">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeaderCell className="sticky top-0 bg-white">Última Venta</TableHeaderCell>
                                    <TableHeaderCell className="sticky top-0 bg-white">Usuario</TableHeaderCell>
                                    <TableHeaderCell className="sticky top-0 bg-white">Total Comisión</TableHeaderCell>
                                    <TableHeaderCell className="sticky top-0 bg-white">CantVentas</TableHeaderCell>
                                    <TableHeaderCell className="sticky top-0 bg-white text-center">Detalle</TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableData && tableData.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.ultimaVenta}</TableCell>
                                        <TableCell>{item.nombreRecibe}</TableCell>
                                        <TableCell>{item.totalComision}</TableCell>
                                        <TableCell>{item.cantVentas}</TableCell>
                                        <TableCell className="flex justify-center items-center">
                                            <span
                                                onClick={() => handleClickDetalle(item.id_tbl_usuario, item.nombreRecibe)}
                                                className="icon-[mdi--account-details-outline] w-7 h-7 text-green-700 hover:text-green-800 transition-colors duration-200 cursor-pointer"
                                            >
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-4">
                        <Paginacion pageCount={pageCount} onPageChange={handlePageClick} />
                    </div>
                </div>


                <div className="w-full md:w-1/2 border bg-white shadow-lg rounded-lg p-6 flex flex-col h-full">
                    <div className="mb-4">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center">
                                <label className="font-bold text-lg text-gray-700">
                                    Detalle cashback de
                                    <span className="font-semibold text-lg text-green-800 ml-1">
                                        {usuarioDetalle}
                                    </span>
                                </label>
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="font-semibold text-gray-600">
                                    Total:
                                    <span className="font-normal text-gray-800 ml-1">
                                        $ {totalComision}
                                    </span>
                                </label>
                                <DescargarCashbackDetalle
                                    data={tableDetail}
                                    usuario={usuarioDetalle}
                                    totalComision={totalComision}
                                />
                            </div>
                        </div>
                        <Divider />
                    </div>

                    <div className="flex-1 overflow-auto">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeaderCell className="sticky top-0 bg-white">Fecha</TableHeaderCell>
                                    <TableHeaderCell className="sticky top-0 bg-white">Cliente</TableHeaderCell>
                                    <TableHeaderCell className="sticky top-0 bg-white">TipoVenta</TableHeaderCell>
                                    <TableHeaderCell className="sticky top-0 bg-white">Comisión</TableHeaderCell>
                                    <TableHeaderCell className="sticky top-0 bg-white">Suscripción</TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentItems.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.fecha}</TableCell>
                                        <TableCell>{item.nombreCliente}</TableCell>
                                        <TableCell>
                                            {item.tipoComision === "propia" ? (
                                                <div
                                                    className="relative inline-flex items-center"
                                                    onMouseEnter={() => setHoveredItemIndex(index)}
                                                    onMouseLeave={() => setHoveredItemIndex(null)}
                                                >
                                                    <span className="icon-[pepicons-print--person-checkmark-circle] w-6 h-6 text-green-600 hover:text-green-700 transition-colors duration-200" />
                                                    {hoveredItemIndex === index && (
                                                        <span className="absolute left-full ml-3 px-3 py-1.5 bg-white text-gray-800 font-medium text-sm rounded-md border shadow-lg z-10 whitespace-nowrap">
                                                            VENTA PERSONAL
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div
                                                    className="relative inline-flex items-center"
                                                    onMouseEnter={() => setHoveredItemIndex(index)}
                                                    onMouseLeave={() => setHoveredItemIndex(null)}
                                                >
                                                    <span className="icon-[pepicons-pencil--people-circle] w-6 h-6 text-orange-500 hover:text-orange-600 transition-colors duration-200" />
                                                    {hoveredItemIndex === index && (
                                                        <span className="absolute left-full ml-3 px-3 py-1.5 bg-white text-gray-800 font-medium text-sm rounded-md border shadow-lg z-10 whitespace-nowrap">
                                                            {item.nombreOtorga}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>{item.total}</TableCell>
                                        <TableCell className={`text-[${item.colorempresa}]`}>
                                            {item.suscripcion}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-4">
                        <Paginacion
                            pageCount={Math.ceil(tableDetail.length / ITEMS_PER_PAGE)}
                            onPageChange={handlePageDetailClick}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GraficaCashback;
