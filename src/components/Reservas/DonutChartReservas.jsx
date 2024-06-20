import { DonutChart, Legend } from '@tremor/react';
import React from 'react';

const DonutChartReservas = ({data}) => {
    const sumarArray=(array)=>{
        return array.reduce((acumulador, valorActual) => acumulador + parseFloat(valorActual), 0);
    }
    console.log("🚀 ~ DonutChartReservas ~ datos:", data)
    
    return (
        <>
            <div className='flex gap-36 justify-center'>
            {
                Object.entries(data).map(([nombre, estados]) => {
                    var est =  Object.entries(estados);
                    console.log("Estados", estados.Confirmadas);
                    const status = [
                        {
                            "nombre": "Confirmadas",
                            "valor":sumarArray(estados.Confirmadas)
                        },
                        {
                            "nombre": "Pendientes",
                            "valor":sumarArray(estados.Pendientes)
                        },
                        {
                            "nombre": "Canceladas",
                            "valor":sumarArray(estados.Canceladas)
                        }
                    ];
                    return <div className="flex flex-col items-center justify-center">
                        <label className=''>{nombre}</label>
                        <DonutChart 
                            data={status} 
                            category="valor"
                            index="nombre" 
                            //valueFormatter={valueFormatter}
                            //con p can
                            colors={['lime', 'yellow', 'rose']}
                            className="w-32" 
                        />
                    </div>;
                })
            }
            </div>
        </>
    );
};

export default DonutChartReservas;