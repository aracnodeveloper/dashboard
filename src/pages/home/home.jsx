import React from 'react';
import { useEffect, useState } from "react";
import Navbar from '../../components/global_components/nabvar/Navbar';
import Reservas from '../reservas/Reservas';
import CuentasGratis from '../cuentasGratis/CuentasGratis';
import Colaborativo from '../Colaborativo/Colaborativo';
import Suscripciones from '../Suscripciones/Suscripciones';
import Cashback from '../Cashback/Cashback';


/*const Reservas = lazy(() => import('../reservas/Reservas'));
const Ventas = lazy(() => import('../ventas/Ventas'));*/

const Home = () => {
    const [menuOption, setMenuOption]=useState(0);
    const menus=[
        <Reservas></Reservas>,
        <CuentasGratis></CuentasGratis>,        
        <Colaborativo></Colaborativo>,
        <Suscripciones></Suscripciones>,
        <Cashback></Cashback>
    ];

    var bd = JSON.parse(localStorage.getItem('datos'));
    //comentar para que no redirija cuando mno tiene sesion
    if(!bd || !bd.data.permisos.perfil.dashboard){
        window.location.href="https://visitaecuador.com"
    }
    
    return (
        <div className='flex'>
            <Navbar changeMenu={setMenuOption} activo={menuOption}></Navbar>
            {/*<Suspense> {menus[menuOption]}</Suspense>*/}
            {menus[menuOption]}
        </div>
    );
};
export default Home;