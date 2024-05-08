import React, { useEffect, useState } from 'react';
import { RiSearch2Line } from '@remixicon/react';
import { AreaChart, BarChart } from '@tremor/react';
import { Select, SelectItem } from '@tremor/react';
import { Button} from '@tremor/react';
import { DateRangePicker, DonutChart, Legend } from '@tremor/react'
import { repCuentasGratisController } from '../../Controllers/repCuentasGratisController';
import ContadorRedes from './ContadorRedes';


const GraficaCuentasGratis = () => {
    const [chartdata, setChardata] = useState()
    const [chartCategorias, setCharCategorias] = useState();
    const colores= ['gray', 'blue', 'rose','lime'];   
    const [valueGroup, setValueGroup] = useState("d");
    const [valueRange, setValueRange] = useState({
        from: new Date((new Date).getTime() - (7 * 24 * 60 * 60 * 1000)),
        to: new Date()
    });
    const [msgRange, setMsgRange] = useState("");
    //const [msgGroup, setMsgGroup] = useState("");
    const [grafica, setGrafica] = useState("1")
    const [primerEjecucion, setPrimerEjecucion] = useState(true);
    const [periodo, setPeriodo] = useState("3600000");
    const [totales, setTotales] = useState();
    const [totalesAnt, setTotalesAnt] = useState();
    const [maximo, setMaximo]=useState(0);

    const HandleChangeGrafica = (event) => {
        setGrafica(event)
    }

    const HandleChangePeriodo = (event) => {
        setPeriodo(event);
    }

    const handleSearch = () => {
        if (valueRange == null || valueRange.from == null || valueRange.to == null)
            setMsgRange("Ingrese un rango de fechas");
        else
            setMsgRange("");     

        if (msgRange == "") {
            //console.log(valueRange.from + " --------  " + valueRange.to);
            fetchData(valueRange.from, valueRange.to,valueGroup)
        }
    }
    const fetchData = (inicio, fin, grupo) => {
        repCuentasGratisController(inicio, fin, grupo).then((result) => {
            if (result) {
                console.log(result.datos)
                setChardata(result.datos);
                //setTableData(result.datos);
                setCharCategorias(result.categorias);
                setTotales(result.totales);
               // console.log("----*");
                //console.log(result.totales)
                var estados = {};
                estados["dateUnformat"] = false;
                result.categorias.map((item) => {
                    estados[item] = false;
                })
               // setOrdenKeys(estados)
                setMaximo(result.maximo);
                //console.log("M{aximo: "+result.maximo)
            }
        })
        const dias=fin.getTime()-inicio.getTime();
        const diferencia= Math.floor(dias/(1000*60*60*24));      
        //console.log("diferencia"+diferencia);
        
        const inicioAnt=new Date(inicio);
        inicioAnt.setDate(inicioAnt.getDate()-diferencia);

        //console.log("inicio "+inicioAnt);

        const finAnt=new Date(inicio);
        finAnt.setDate(finAnt.getDate()-1);
        //console.log("fin "+finAnt);

        repCuentasGratisController(inicioAnt, finAnt, grupo).then((result) => {
            if (result) {
                setTotalesAnt(result.totales);
            }
        })
    }

    useEffect(() => {
        if (primerEjecucion) {
            console.log("primera vez cuentasGratis" + (new Date()).toString())           
            fetchData(valueRange.from, valueRange.to,valueGroup);
            setPrimerEjecucion(false); // Marca la primera ejecución como completada
        }

        const intervalId = setInterval(() => {
            console.log("programado cuentasGratis" + (new Date()).toString())
            fetchData(valueRange.from, valueRange.to, valueGroup);
        }, parseInt(periodo));

        return () => clearInterval(intervalId);
    }, [periodo]);

    const graficas = [
        <>
            {
                chartdata != null ?
                    <>                   
                    <AreaChart
                        className="h-3/6 mt-6 "
                        data={chartdata}
                        index="date"
                        colors={colores}
                        categories={chartCategorias}
                        //valueFormatter={valueFormatter} 
                        yAxisWidth={60}
                        onValueChange={(v) => console.log(v)}
                        showLegend={false}
                        showYAxis={true}
                        showGridLines={true}
                        maxValue={maximo}
                    />                    
                    </>: <div></div>
            }
        </>,
        <>
            {
                chartdata != null ?
                <>
                   
                    <BarChart className="h-3/6 mt-6" 
                        data={chartdata}
                        index="date"
                        categories={chartCategorias}
                        colors={colores}
                        yAxisWidth={60}
                        //valueFormatter={valueFormatter} 
                        showLegend={false}
                        showGridLines={true}
                        maxValue={maximo}                        
                    />
                </>: <div></div>
            }
        </>
    ];
    return (
        <>
            <div className='flex flex-wrap gap-x-6 gap-y-3 justify-center items-end mt-3 z-50' >
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
                </div>
                <div className="w-52">
                    <label className="font-semibold text-lg">Tipo de gráfico:</label>
                    <Select defaultValue='0' value={grafica} onValueChange={HandleChangeGrafica}>
                        <SelectItem value="0"><div className='flex '><span class="icon-[akar-icons--statistic-up] mr-3 w-6 h-6"></span>Gráfico lineal</div></SelectItem>
                        <SelectItem value="1"><div className='flex '><span class="icon-[icon-park--chart-histogram] mr-3 w-6 h-6"></span>Gráfico de barras</div></SelectItem>
                    </Select>
                </div>
                <div className="w-52">
                    <label className="font-semibold text-lg">Periodo de actualización:</label>
                    <Select defaultValue='3600000' value={periodo} onValueChange={HandleChangePeriodo}>
                        <SelectItem value="600000"><div className='flex '><span class="icon-[octicon--stopwatch-16] mr-3 w-6 h-6"></span>10 minutos</div></SelectItem>
                        <SelectItem value="1800000"><div className='flex '><span class="icon-[octicon--stopwatch-16] mr-3 w-6 h-6"></span>30 minutos</div></SelectItem>
                        <SelectItem value="3600000"><div className='flex '><span class="icon-[octicon--stopwatch-16] mr-3 w-6 h-6"></span>1 hora</div></SelectItem>
                    </Select>
                </div>                
                <div className="">
                    <Button variant="secondary" icon={RiSearch2Line} onClick={() => handleSearch()}>Buscar</Button>
                </div>
            </div>
            <div className='flex justify-center mt-4' >
                {
                    (totales&&totalesAnt)&&<div className="flex flex-wrap items-center justify-center gap-3">
                        <ContadorRedes 
                            titulo={"Apple"} 
                            valActual={totales.find(item=>item.nombre=="apple").total} 
                            valAnterior={totalesAnt.find(item=>item.nombre=="apple").total} 
                            icono={"icon-[simple-icons--apple]"} 
                        />
                        <ContadorRedes 
                            titulo={"Facebook"} 
                            valActual={totales.find(item=>item.nombre=="facebook").total} 
                            valAnterior={totalesAnt.find(item=>item.nombre=="facebook").total}  
                            icono={"icon-[logos--facebook]"} 
                        />
                        <ContadorRedes 
                            titulo={"Google"} 
                            valActual={totales.find(item=>item.nombre=="google").total} 
                            valAnterior={totalesAnt.find(item=>item.nombre=="google").total}  
                            icono={"icon-[logos--google-icon]"} 
                        />
                        <ContadorRedes 
                            titulo={"Registro"} 
                            valActual={totales.find(item=>item.nombre=="registro").total} 
                            valAnterior={totalesAnt.find(item=>item.nombre=="registro").total}  
                            icono={"icon-[ph--user-circle-plus-fill]"} 
                        /> 
                        <div className='flex flex-col rounded-xl shadow-xl w-60 items-center gap-5 h-40'>
                            <div className='flex items-center '>
                                <h1 className='mt-2 ml-4 text-xl font-semibold text-center'>Estadisticas de descargas</h1>                                
                            </div>
                            <div className='flex gap-4 pl-4'>
                                <span class='icon-[simple-icons--apple] w-10 h-10 cursor-pointer' onClick={()=>{window.open("https://appstoreconnect.apple.com/analytics/app/d30/1385161516/overview?iaemeasure=totalDownloads")}}></span>
                                <span class='icon-[devicon--android] w-11 h-11 cursor-pointer' onClick={()=>{window.open("https://play.google.com/console/u/0/developers/6092364133521490906/app/4973313953304959541/app-dashboard?timespan=thirtyDays")}}></span>
                            </div>
                        </div>
                        <div className='flex rounded-xl shadow-xl w-60 items-center justify-center '>
                            <DonutChart 
                                data={totales} 
                                category="total"
                                index="nombre" 
                                //valueFormatter={valueFormatter} 
                                colors={colores} 
                                className="w-28 z-50"
                            /> 

                            <Legend categories={chartCategorias} 
                                colors={colores} 
                                className="max-w-20 py-7 ml-4 z-0"    
                            />  
                                   
                        </div>                      
                </div>
                
                }
            </div>
            {
                graficas[parseInt(grafica)]
            }
            </>
    );
};

export default GraficaCuentasGratis;