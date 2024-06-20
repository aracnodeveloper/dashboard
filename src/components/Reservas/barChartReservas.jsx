import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { DonutChart, Legend } from '@tremor/react';
import DonutChartReservas from './DonutChartReservas';

const BarChartReservas = ({listPerson, datos, unidad}) => {
    var listaValores = {}; 
       
    const getSeries = (data) => {
        let fechas = Object.keys(data);
        let listaNombres = [];
        let listaSeries = [];

        fechas.forEach((item, index) => {
            data[item].forEach((value) => {
                // Verificar si ya existe la entrada para el servicio en listaValores
                if (!listaValores[value.servicio]) {
                    listaValores[value.servicio] = {
                        Confirmadas: [],
                        Canceladas: [],
                        Pendientes: []
                    };
                }
                if (index == 0) {
                    listaNombres.push(value.servicio)
                }
                // Ahora puedes acceder y modificar las propiedades
                listaValores[value.servicio]["Confirmadas"].push(value.confirmada==null?"0":value.confirmada);
                listaValores[value.servicio]["Canceladas"].push(value.cancelada==null?"0":value.cancelada);
                listaValores[value.servicio]["Pendientes"].push(value.pendiente==null?"0":value.pendiente);
            });
        });

        console.log(listaValores);

        let personas = Object.keys(listaValores);


        personas.forEach((item, index) => {
            
            listaSeries.push({
                name: 'Canceladas',
                type: 'bar',
                stack: item,
                color:"#f43f5e",
                data: listaValores[item].Canceladas,
            });

            listaSeries.push({
                name: 'Pendientes',
                type: 'bar',
                stack: item,
                color: "#eab308",
                data: listaValores[item].Pendientes,
            });

            listaSeries.push({
                name: 'Confirmadas',
                type: 'bar',
                stack: item,
                color: "#84cc16",
                data: listaValores[item].Confirmadas,
                label: {
                    show: true,
                    position: "top",
                    formatter: function (params) {
                        //console.log("🚀 ~ personas.forEach ~ params:", params)
                        let totalStack = 0;
                        listaSeries.forEach(series => {
                            if (series.stack === item) {
                                totalStack += parseInt(series.data[params.dataIndex]);
                            }
                        });
                        return totalStack>0?   `${item.split(" ")[0]}:\n ${unidad=="dinero"?"$ ":""}${totalStack}`:"";
                    }
                }
            });
        });
        return listaSeries;
    };

    const option = {
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'transparent', // Hacer el fondo transparente para aplicar nuestros propios estilos
            borderWidth: 0,
            textStyle: {
                color: '#000', // Color del texto
            },
            formatter: function (params) {
                //console.log("🚀 ~ getOptions ~ params:", params)
                let stacks = {};
                const numStacks =3;
                let indexStack = 0;

                listPerson.forEach(person => {
                    stacks[person] = [];
                });

                params.forEach((param, index) => {
                    if(index<listPerson.length*3){
                        stacks[listPerson[indexStack]].push({
                            name: param.seriesName,
                            value: param.value,
                            color: param.color,
                        });

                        if ((index + 1) % numStacks === 0) {
                            indexStack += 1;
                        }
                    }
                    
                    
                });

                let content = `<div class="bg-white p-4 rounded-lg shadow-lg text-gray-800">
                    <div class="font-bold">${params[0].axisValue}</div>
                    <div class="flex space-x-4">`;

                for (let stack in stacks) {
                    
                        //if(stacks[stack].length>0 ){
                            content += `<div>
                                <div class="font-bold mb-2">${stack}</div>`;
                            stacks[stack].reverse().forEach(item => {
                                content += `<div class="flex items-center">
                                    <span style="background-color:${item.color}; width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 8px;"></span>
                                    ${item.name}: ${unidad=="dinero"?"$":""}${item.value}
                                </div>`;
                            });
                            content += `</div>`;
                        //}
                        
                }

                content += `</div></div>`;
                return content;
            }
        },
        legend: {
            data: ['Confirmadas', 'Canceladas', 'Pendientes'],
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: Object.keys(datos)
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: getSeries(datos)
        
    };
   
    //console.log("🚀 ~ BarChartReservas ~ option.getSeries(datos):", getSeries(datos))
    const echart = <ReactEcharts option={option} style={{ height: '400px', width: '100%' }} />



    return (
        <>
        <div className='flex flex-col w-full gap-7'>
        {
            listaValores&&<DonutChartReservas data = {listaValores}/>
        }
        {echart}
        </div>
        </>
    );
};

export default BarChartReservas;
