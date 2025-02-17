import React, { useEffect, useState } from 'react';
import { repReservaController } from '../../Controllers/repReservaController';
import { AreaChart, BarChart } from '@tremor/react';
import { RiSearch2Line, RiArrowUpDownLine } from '@remixicon/react';
import { Select, SelectItem } from '@tremor/react';
import { Button, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@tremor/react';
import { DateRangePicker, DonutChart, Legend } from '@tremor/react'
import ReactEcharts from 'echarts-for-react';
import BarChartReservas from './barChartReservas';

const GraficaReservas = () => {
    const [chartdata, setChardata] = useState()
    const [tableData, setTableData] = useState()
    const [ordenKeys, setOrdenKeys] = useState()
    const [chartCategorias, setCharCategorias] = useState();
    const [option, setOption] =useState();
    const [chartFechas, setChartFechas] = useState();
    const colores= ['lime', 'indigo', 'orange','cyan', 'fuchsia','blue'];
    const [valueGroup, setValueGroup] = useState("d");
    const [valueRange, setValueRange] = useState({
        from: new Date((new Date).getTime() - (7 * 24 * 60 * 60 * 1000)),// new Date("2024-05-01"),
        to:new Date()  //new Date("2024-05-03") 
    });
    const [msgRange, setMsgRange] = useState("");
    const [msgGroup, setMsgGroup] = useState("");
    const [grafica, setGrafica] = useState("1")
    const [primerEjecucion, setPrimerEjecucion] = useState(true);
    const [periodo, setPeriodo] = useState("3600000");
    const [totales, setTotales] = useState();
    const [mostrar,setMostrar]=useState("reservas");
    const [maximo, setMaximo]=useState(0);
    const [unidad,setUnidad]=useState("cantidad");
    const [titulosGrafica,setTitulosGrafica]=useState("Gráfica de reservas")

    const HandleChangeGrafica = (event) => {
        setGrafica(event)
    }

    const HandleChangePeriodo = (event) => {
        setPeriodo(event);
    }

    const HandleChangeUnidad=(event)=>{
        console.log(event);
        setUnidad(event);
        //fetchData(valueRange.from, valueRange.to, "reservas", valueGroup,mostrar,event);
        //console.log(event);
    }

    const HandleChangeMostrar = (event) => {
        setMostrar(event);
        //fetchData(valueRange.from, valueRange.to, "reservas", valueGroup,event,unidad);
    }

    const fetchData = (inicio, fin) => {
        console.log("Unida ", unidad)
        repReservaController(inicio, fin, mostrar,valueGroup,unidad).then((result) => {
            if (result) {
                console.log(result);
                console.log("datooos");
                console.log(result.datos)
                setChardata(result.datos); 
                setCharCategorias(result.categorias); 
            }
        })
    }

    useEffect(() => {
        if (primerEjecucion) {
            console.log("primera vez reservas" + (new Date()).toString())
            //console.log("most: "+mostrar);
            fetchData(valueRange.from, valueRange.to);
            setPrimerEjecucion(false); // Marca la primera ejecución como completada
        }

        const intervalId = setInterval(() => {
            console.log("programado reservas" + (new Date()).toString())
            fetchData(valueRange.from, valueRange.to);
        }, parseInt(periodo));

        return () => clearInterval(intervalId);
    }, [periodo]);

    

    const handleSearch = () => {
        if (valueRange == null || valueRange.from == null || valueRange.to == null)
            setMsgRange("Ingrese un rango de fechas");
        else
            setMsgRange("");
        if (valueGroup == null)
            setMsgGroup("Ingrese un método de agrupado");
        else
            setMsgGroup("");

        setTitulosGrafica(`Gráfica de ${mostrar}`);

        if (msgRange == "" && msgGroup == "") {
            console.log(valueRange.from + " 🚀  " + valueRange.to + "   " + valueGroup+"   "+mostrar);
            fetchData(valueRange.from, valueRange.to)
        }
    }

    
    return (
        <>
        <p className=" font-semibold text-2xl ml-8 mt-3 pl-20">Reservas</p>
            <div className='flex flex-wrap gap-x-6 gap-y-3 justify-center items-end mt-3 z-50 pl-20' >
            
                <div className="">
                    <p className="font-semibold text-lg">Seleccionar rango de fechas:</p>
                    <DateRangePicker value={valueRange} placeholder="seleccione Rango" selectPlaceholder="Seleccionar" onValueChange={setValueRange} />
                    <div className='ml-2 text-red-600 font-bold'>{msgRange}</div>
                </div>

                <div className="">
                    <label className="font-semibold text-lg">Agrupar por:</label>
                    <Select id="distance" name="distance" placeholder="Agrupar por:" value={valueGroup} onValueChange={setValueGroup} className="" >
                        <SelectItem value="d"><div className='flex '><span class="icon-[fluent-mdl2--date-time-mirrored] mr-3 w-6 h-6"></span>Día</div></SelectItem>
                        <SelectItem value="m"><div className='flex '><span class="icon-[ion--calendar-number-outline] mr-3 w-6 h-6"></span>Mes</div></SelectItem>
                        <SelectItem value="a"><div className='flex '><span class="icon-[uiw--date] mr-3 w-6 h-6"></span>Año</div></SelectItem>
                    </Select>
                    <div className='ml-2 text-red-600 font-bold'>{msgGroup}</div>
                </div>
                
                <div className="w-52">
                    <label className="font-semibold text-lg">Periodo de actualización:</label>
                    <Select defaultValue='3600000' value={periodo} onValueChange={HandleChangePeriodo}>
                        <SelectItem value="600000"><div className='flex '><span class="icon-[octicon--stopwatch-16] mr-3 w-6 h-6"></span>10 minutos</div></SelectItem>
                        <SelectItem value="1800000"><div className='flex '><span class="icon-[octicon--stopwatch-16] mr-3 w-6 h-6"></span>30 minutos</div></SelectItem>
                        <SelectItem value="3600000"><div className='flex '><span class="icon-[octicon--stopwatch-16] mr-3 w-6 h-6"></span>1 hora</div></SelectItem>
                    </Select>
                </div>
                <div>
                    <label className="font-semibold text-lg">Mostrar:</label>
                    <Select defaultValue='reservas' value={mostrar} onValueChange={HandleChangeMostrar}>
                        <SelectItem value="reservas" ><div className='flex '><span class="icon-[ph--call-bell] mr-3 w-6 h-6"></span>Reservas</div></SelectItem>
                        <SelectItem value="fee"><div className='flex '><span class="icon-[tdesign--undertake-transaction] mr-3 h-6 w-6"></span>fee</div></SelectItem>
                        <SelectItem value="canje"><div className='flex '> <span class="icon-[material-symbols--change-circle-outline-rounded] mr-3 h-6 w-6"></span>Canje</div></SelectItem>
                        <SelectItem value="premios"><div className='flex '> <span class="icon-[streamline--shopping-gift-reward-box-social-present-gift-media-rating-bow] mr-3 h-6 w-6"></span>Premios</div></SelectItem>
                    </Select>
                </div>
                <div>
                    <label className="font-semibold text-lg">Unidad:</label>
                    <Select defaultValue='cantidad' value={unidad} onValueChange={HandleChangeUnidad}>
                        <SelectItem value="cantidad" ><div className='flex '><span class="icon-[fluent--number-symbol-24-filled] mr-3 h-6 w-6"></span>Cantidad</div></SelectItem>
                        <SelectItem value="dinero"><div className='flex '><span class="icon-[fluent--money-hand-20-regular] mr-3 h-6 w-6"></span>Dinero</div></SelectItem>
                    </Select>
                </div>
                <div className="">
                    <Button variant="secondary" icon={RiSearch2Line} onClick={() => handleSearch()}>Buscar</Button>
                </div>
            </div>
            <div className='flex justify-center mt-10'>
                {
                    chartdata&&<BarChartReservas listPerson={chartCategorias} datos={chartdata} unidad={unidad} />
                    
                }
            </div>
     
           
        </>
    );
};

export default GraficaReservas;
