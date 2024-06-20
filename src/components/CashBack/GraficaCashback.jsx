import React, { useEffect, useState } from 'react';
import { repCashbakController, repCashbakDetailController } from '../../Controllers/repCashbackController';
import ReactPaginate from 'react-paginate';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Divider } from '@tremor/react';
import Paginacion from './Paginacion';

const GraficaCashback = () => {
    const [tableData, setTableData] = useState([]);
    const [pageCount] = useState(8); // Establece 8 páginas por defecto
    const [currentPage, setCurrentPage] = useState(0);
    const [tableDetail, setTableDetail] = useState([]);
    const [usuarioDetalle, setUsuarioDetalle] = useState();
    const [hoveredItemIndex, setHoveredItemIndex] = useState(null);

    const [currentPageDetail, setCurrentPageDetail] = useState(0);
    //const [hoveredItemIndex, setHoveredItemIndex] = useState(null);

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
        <div className='flex flex-col w-full'>
            <span className=" font-semibold text-2xl ml-8 mt-3">Cashback</span>

            <div className="flex px-6 py-3 gap-5 w-full">
                <div className=' w-1/2 border shadow-lg rounded-lg p-6 flex flex-col justify-between'>
                    <div>
                        <label className="font-semibold text-lg ml-3">Lista de totales de cashback</label>
                        <Divider />
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeaderCell>Última Venta</TableHeaderCell>
                                    <TableHeaderCell>Usuario</TableHeaderCell>
                                    <TableHeaderCell>Total Comisión</TableHeaderCell>
                                    <TableHeaderCell>CantVentas</TableHeaderCell>
                                    <TableHeaderCell className=''>Detalle</TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableData && tableData.map((item, index) => (
                                    <TableRow className='' key={index}>
                                        <TableCell>{item.ultimaVenta}</TableCell>
                                        <TableCell>{item.nombreRecibe}</TableCell>
                                        <TableCell>{item.totalComision}</TableCell>
                                        <TableCell className=''>{item.cantVentas}</TableCell>
                                        <TableCell className='flex justify-center'><span onClick={() => handleClickDetalle(item.id_tbl_usuario, item.nombreRecibe)} class="icon-[mdi--account-details-outline] w-7 h-[28.5px] text-green-900 cursor-pointer"></span></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>


                    <Paginacion pageCount={pageCount} onPageChange={handlePageClick}></Paginacion>

                </div>

                <div className=' w-1/2 border shadow-lg rounded-lg p-6 flex flex-col justify-between'>
                    <div className='flex flex-col'>
                        <div className='flex justify-between'>
                            <label className="font-bold text-lg ml-3">Detalle cashback de <label className="font-semibold text-lg text-green-900">{usuarioDetalle}</label></label>
                            <label className='font-semibold'>Total: <label className='font-normal'>$ {totalComision}</label></label>
                        </div>
                        <Divider />

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeaderCell>Fecha</TableHeaderCell>
                                    <TableHeaderCell>Cliente</TableHeaderCell>
                                    <TableHeaderCell>TipoVenta</TableHeaderCell>
                                    <TableHeaderCell>Comisión</TableHeaderCell>
                                    <TableHeaderCell>Suscripción</TableHeaderCell>
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
                                                    className="relative inline-block"
                                                    onMouseEnter={() => setHoveredItemIndex(index)}
                                                    onMouseLeave={() => setHoveredItemIndex(null)}
                                                >
                                                    <span className="icon-[pepicons-print--person-checkmark-circle] w-6 h-6 text-green-600" />
                                                    {hoveredItemIndex === index && (
                                                        <span className="absolute left-full ml-3 px-3 py-1 bg-gray-100 text-black font-semibold rounded border shadow-lg">VENTA PERSONAL</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div
                                                    className="relative inline-block"
                                                    onMouseEnter={() => setHoveredItemIndex(index)}
                                                    onMouseLeave={() => setHoveredItemIndex(null)}
                                                >
                                                    <span className="icon-[pepicons-pencil--people-circle] w-6 h-6 text-orange-500" />
                                                    {hoveredItemIndex === index && (
                                                        <span className="absolute left-full ml-3 px-3 py-1 bg-gray-100 text-black font-semibold rounded border shadow-lg">{item.nombreOtorga}</span>
                                                    )}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>{item.total}</TableCell>
                                        <TableCell className={`text-[${item.colorempresa}]`}>{item.suscripcion}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                    </div>

                    <Paginacion pageCount={Math.ceil(tableDetail.length / ITEMS_PER_PAGE)} onPageChange={handlePageDetailClick}></Paginacion>



                </div>
            </div>
        </div>
    );
};

export default GraficaCashback;
