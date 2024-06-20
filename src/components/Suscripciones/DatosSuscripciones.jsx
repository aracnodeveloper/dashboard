import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow,Badge } from '@tremor/react';
import { Select, SelectItem ,DatePicker,DateRangePicker, DonutChart, Legend } from '@tremor/react'
import { RiSearch2Line, RiArrowUpDownLine,RiFlag2Line  } from '@remixicon/react';
import { repSuscripcionesController } from '../../Controllers/repSuscripcionesController';
import { format, parseISO, isBefore, isAfter, addDays } from 'date-fns';

const DatosSuscripciones = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(); 
    const [tableData, setTableData] = useState()
    const [msgRange, setMsgRange] = useState("");
    const [mostrar,setMostrar]=useState("todas");
    const [valueFrom, setValueFrom] = useState(new Date(Date.now() -(30 * 24 * 60 * 60 * 1000)));
    const [valueTo, setValueTo] = useState(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000));

    const handleSearch = () => {
        if (valueFrom == null || valueTo == null)
            setMsgRange("* Ingrese fechas");
        else
            setMsgRange("");
      
        if (msgRange == "") {
            console.log(valueFrom + "   " + valueTo );
            fetchData();
        }
    }
    const HandleChangeMostrar = (event) => {
        setMostrar(event);
        if(event=="todas"){
            setTableData([...data]);
        }
        if(event=="activas"){
            const activas = [...data].filter((item) => estadoSuscripcion(item.fechaSuscripcion));
            setTableData(activas);
        }
        if(event=="inactivas"){
            const activas = [...data].filter((item) => !estadoSuscripcion(item.fechaSuscripcion));
            setTableData(activas);
        }
    }
    const fetchData = () => {
        setLoading(true)
        repSuscripcionesController(valueFrom,valueTo,mostrar).then((result) => {
            if (result) {
                console.log(result.datos)               
                setTableData(result.datos);        
                setData(result.datos);
                setLoading(false)
            }else{
                setLoading(false)
            }
        })
    }

    useEffect(() => {       
        console.log("primera vez reservas" + (new Date()).toString())
        //console.log("most: "+mostrar);
        fetchData();     
    },[]);

    const estadoSuscripcion=(rangoFechas)=>{
        const fechas = rangoFechas.split(" - "); // Divide la cadena en un array de fechas
        const ultimaFecha = fechas[fechas.length - 1];
        
        const fechaActual = new Date();
        const fechaParsed = parseISO(ultimaFecha);
        const fechaSieteDias = addDays(fechaActual, 7);
        if (isBefore(fechaParsed, fechaActual)) 
            return false;
        else
            return true;

    }

    const FechaComponent = ({ rangoFechas }) => {
        const fechas = rangoFechas.split(" - "); // Divide la cadena en un array de fechas
        const ultimaFecha = fechas[fechas.length - 1];
        
        const fechaActual = new Date();
        const fechaParsed = parseISO(ultimaFecha);
        const fechaSieteDias = addDays(fechaActual, 7);
      
        let estilo = "", texto="", icono="";
      
        if (isBefore(fechaParsed, fechaActual)) {
          estilo = 'red-500';
          icono = <span class="icon-[codicon--error] "></span>
        } else if (isAfter(fechaParsed, fechaActual) && isBefore(fechaParsed, fechaSieteDias)) {
          estilo = 'amber-500';
          icono = <span class="icon-[zmdi--alert-circle-o]"></span>
          texto="";
        } else if (isAfter(fechaParsed, fechaSieteDias)) {
          estilo = 'green-500';
          icono = <span class="icon-[mdi--check-circle-outline] h-[16px] w-[16px]"></span>
        }
      
        return (
          <div className={estilo +' flex gap-2 items-center'} >
            <Badge className='ml-2 pt-1' color={estilo}>{icono}</Badge>
           {rangoFechas}           
          </div>
        );
      };

    return (
        <>
        <p className=" font-semibold text-2xl ml-8 mt-3">Suscripciones</p>
        <div className='flex flex-wrap gap-x-6 gap-y-3 justify-center items-end mt-3 z-50' >
            
            <div className="">
                <p className="font-semibold text-lg">fecha desde:</p>
                <DatePicker className="mx-auto max-w-sm" value={valueFrom} onValueChange={setValueFrom}  placeholder="seleccione Fecha" selectPlaceholder="Seleccionar"/>                
            </div>  
            <div className="">
                <p className="font-semibold text-lg">fecha hasta:</p>
                <DatePicker className="mx-auto max-w-sm" value={valueTo} onValueChange={setValueTo} placeholder="seleccione Fecha" selectPlaceholder="Seleccionar"/>                
            </div>
            
            <div>
                <label className="font-semibold text-lg">Estado de suscripción:</label>
                <Select defaultValue='todas' value={mostrar} onValueChange={HandleChangeMostrar}>
                    <SelectItem value="activas" ><div className='flex '><span class="icon-[mdi--check-circle-outline] mr-3 h-6 w-6"></span>Activas</div></SelectItem>
                    <SelectItem value="inactivas"><div className='flex '><span class="icon-[codicon--error] mr-3 h-6 w-6"></span>Inactivas</div></SelectItem>                  
                    <SelectItem value="todas"><div className='flex '><span class="icon-[mdi--checkbox-marked-circle-minus-outline] mr-3 h-6 w-6"></span>Todas</div></SelectItem>                  
                </Select>
            </div>
            
            <div className="">
                <Button variant="secondary" icon={RiSearch2Line} onClick={() =>loading?{}: handleSearch()}>{loading?<span class="icon-[line-md--loading-twotone-loop] w-10 h-4"></span>:"Buscar"}</Button>
                
            </div>
            <div className='ml-2 text-red-600 '>{msgRange}</div>
        </div>
        <div className='mt-5 ml-8'>
        <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">Listado suscripciones y caducidad</h3>
            <Table>      
                <TableHead>        
                    <TableRow>          
                        <TableHeaderCell>IdSus</TableHeaderCell>          
                        <TableHeaderCell>Ci / RUC</TableHeaderCell>   
                        <TableHeaderCell>Cliente</TableHeaderCell>        
                        <TableHeaderCell>Producto Suscripción</TableHeaderCell>          
                        {//<TableHeaderCell className=''>Lugar</TableHeaderCell>  
                        } 
                        <TableHeaderCell>Fecha Suscripción</TableHeaderCell>  
                        <TableHeaderCell>Vendedor</TableHeaderCell>     
                        <TableHeaderCell>Contactos</TableHeaderCell> 
                        <TableHeaderCell className="w-1/20">#Reservas</TableHeaderCell> 
                        <TableHeaderCell>Última-Reserva</TableHeaderCell> 
                    </TableRow>      
                </TableHead>
                <TableBody>
            {                
                tableData&&tableData.map((item)=>(
                    <>                   
                    <TableRow className='text-xs'>          
                        <TableCell>{item.IdSuscripcion}</TableCell>          
                        <TableCell>{item.ci_ruc}</TableCell>          
                        <TableCell className='font-semibold text-blue-600'>{item.cliente}</TableCell>          
                        <TableCell>{item.prod_suscripcion}</TableCell> 
                        {//<TableCell className='text-xs'>{item.lugar}</TableCell>  
                        }  
                        <TableCell className='font-semibold text-blue-700'><FechaComponent rangoFechas={item.fechaSuscripcion}/></TableCell>                         
                        <TableCell className=''>{item.vendedor}</TableCell> 
                        <TableCell>{item.contactos}</TableCell> 
                        <TableCell className='text-center font-semibold'  >{item.cantReservas}</TableCell> 
                        <TableCell>{item.ultimaReservaConfirmada}</TableCell>
                    </TableRow>
                    </>
                ))
            }
                </TableBody>
            </Table>
        </div>
        </>     
    );
};

export default DatosSuscripciones;