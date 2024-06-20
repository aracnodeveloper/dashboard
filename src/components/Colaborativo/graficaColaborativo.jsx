import React, { useEffect, useState } from 'react';
import { RiSearch2Line } from '@remixicon/react';
import { AreaChart, BarChart } from '@tremor/react';
import { Select, SelectItem } from '@tremor/react';
import { Button} from '@tremor/react';
import { DateRangePicker, DonutChart, Legend } from '@tremor/react'
import { repCuentasConCodPromoController } from '../../Controllers/repCuentasConCodPromoController';

const GraficaColaborativo = () => {
    const [chartdata, setChardata] = useState()
    const [chartCategorias, setCharCategorias] = useState();
    const colores= ['gray', 'blue', 'rose','lime','yellow','orange','emerald','sky','indigo','pink','red','amber','stone','green','zinc','fuchsia','violet','teal','slate',
                    'gray', 'blue', 'rose','lime','yellow','orange','emerald','sky','indigo','pink','red','amber','stone','green','zinc','fuchsia','violet','teal','slate',
                    'gray', 'blue', 'rose','lime','yellow','orange','emerald','sky','indigo','pink','red','amber','stone','green','zinc','fuchsia','violet','teal','slate',
                    ];   

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
    const [tipoCuenta ,setTipoCuenta]=useState("gratis");

    const customTooltip = (props) => {
        const { payload, active,label } = props;
        if (!active || !payload) return null;
        var total=0;
        payload.map((category, idx) => {
            total +=parseInt(category.value);
        })

        return (
          <div className=" rounded-tremor-default border border-tremor-border bg-tremor-background p-3 text-tremor-default  ">
            <div className='flex justify-between border-b-2 pb-3'>
                <label>{label}</label>
                <label className='font-semibold'>Suma: {total}</label>
            </div>
           
            <div className='flex flex-wrap max-w-[450px] gap-x-8 gap-y-2 mt-2 justify-center max-h-[500px] overflow-hidden'>
                {payload.map((category, idx) => (
                    category.value!=0?
                <div key={idx} className="w-48 flex  justify-between items-center gap-3">
                    <div className='w-1/12'>
                        <div className=' rounded-full  shadow flex h-4 w-4 items-center justify-center'>
                            <div className={`flex w-1 flex-col bg-${category.color}-500 rounded-full w-2.5 h-2.5`}/>
                        </div>
                    </div>
                    <label className='text-sm text-start w-8/12 font-normal text-gray-500'>{category.dataKey}</label>
                    <label className='w-3/12 text-end font-normal' >{category.value}</label>
                </div>
                :<></>
                )
                )}
            </div>
          </div>
        );
      };

    const HandleChangeGrafica = (event) => {
        setGrafica(event)
    }

    const HandleChangePeriodo = (event) => {
        setPeriodo(event);
    }

    const HandleChangeCuentas = (event) => {
        setTipoCuenta(event);
    }
    const handleSearch = () => {
        if (valueRange == null || valueRange.from == null || valueRange.to == null)
            setMsgRange("Ingrese un rango de fechas");
        else
            setMsgRange("");     

        if (msgRange == "") {
            //console.log(valueRange.from + " --------  " + valueRange.to);
            fetchData(valueRange.from, valueRange.to)
        }
    }
    const fetchData = (inicio, fin) => {
        repCuentasConCodPromoController(inicio, fin, valueGroup,tipoCuenta).then((result) => {        
            if (result) {
                console.log(result.datos)
                setChardata(result.datos);
                //setTableData(result.datos);
                setCharCategorias(result.categorias);
                setTotales(result.totales);
                console.log("Totales: ");
                console.log(result.totales)
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
    }

    useEffect(() => {
        if (primerEjecucion) {
            console.log("primera vez Colaborativo" + (new Date()).toString())           
            fetchData(valueRange.from, valueRange.to,valueGroup);
            setPrimerEjecucion(false); // Marca la primera ejecución como completada
        }

        const intervalId = setInterval(() => {
            console.log("programado Colaborativo" + (new Date()).toString())
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
                        customTooltip={customTooltip}
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
                    <BarChart className="h-3/6 mt-6 z-0" 
                        data={chartdata}
                        index="date"
                        categories={chartCategorias}
                        colors={colores}
                        yAxisWidth={60}
                        //valueFormatter={valueFormatter} 
                        showLegend={false}
                        showGridLines={true}
                        maxValue={maximo} 
                        stack={true}  
                        customTooltip={customTooltip}
                    />
                </>: <div></div>                
            }
        </>
    ];

    


    return (
        <>
            <p className=" font-semibold text-2xl ml-8 mt-3">Colaborativos</p>
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
                <div className="w-52">
                    <label className="font-semibold text-lg">Tipo de cuenta:</label>
                    <Select defaultValue='gratis' value={tipoCuenta} onValueChange={HandleChangeCuentas}>
                        <SelectItem value="gratis"><div className='flex '><span class="icon-[octicon--stopwatch-16] mr-3 w-6 h-6"></span>Pruebas Gratis</div></SelectItem>
                        <SelectItem value="suscripcion"><div className='flex '><span class="icon-[octicon--stopwatch-16] mr-3 w-6 h-6"></span>Suscripciones</div></SelectItem>
                    </Select>
                </div>                
                <div className="">
                    <Button variant="secondary" icon={RiSearch2Line} onClick={() => handleSearch()}>Buscar</Button>
                </div>
            </div>
            <div className='flex justify-center mt-4' >
                {
                    (totales)&&<div className="flex flex-wrap items-center justify-center gap-3">
                        <div className='flex flex-col items-center justify-center '>
                            <DonutChart 
                                data={totales} 
                                category="total"
                                index="nombre" 
                                //valueFormatter={valueFormatter} 
                                colors={colores} 
                                className="w-28"
                            /> 

                            <Legend categories={chartCategorias.map((item)=>(
                                <div className='w-52 flex'>
                                    <label className="whitespace-normal">{item}</label>
                              </div>  
                            ))} 
                                colors={colores} 
                                className="z-0  max-w-[1500px] ml-7"     
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

export default GraficaColaborativo;