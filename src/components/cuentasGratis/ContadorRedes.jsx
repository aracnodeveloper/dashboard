import React from 'react';

const ContadorRedes = ({ titulo, valActual, valAnterior, icono }) => {

    const rendimiento = valActual != 0 ? (((valActual - valAnterior) * 100) / valActual).toFixed(2) : -100;
    return (
        <div>
            <div className='flex flex-col rounded-xl w-60 p-4 shadow-xl '>
                <div className='flex'>
                    <span class={`${icono} w-10 h-10`}></span>
                    <h1 className='mt-2 ml-4 text-xl font-semibold'>{titulo}</h1>
                </div>
                <div className='flex justify-between mt-3'>
                    <label>Total actual:</label>
                    <label>{valActual}</label>
                </div>
                <div className='flex justify-between'>
                    <label>Total Anterior:</label>
                    <label>{valAnterior}</label>
                </div>
                <div className='flex justify-between'>
                    <label>Rendimiento:</label>
                    <label className={`${rendimiento > 0 ? "text-green-600" : "text-red-600"} font-semibold`}>{rendimiento} %</label>
                </div>

            </div>
        </div>
    );
};

export default ContadorRedes;