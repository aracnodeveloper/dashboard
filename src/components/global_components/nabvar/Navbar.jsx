import React from 'react';
import { useState } from 'react';

const Navbar = ({ changeMenu, activo }) => {
    const [open, setOpen] = useState(false);
    const Menus = [
        { title: "Reservas", src: "icon-[emojione-monotone--bellhop-bell]" },
        { title: "Descargas", src: "icon-[line-md--downloading-loop]" },
        { title: "Colaborativo", src: "icon-[ph--users-three-duotone]" },
        { title: "Suscripciones", src:"icon-[fluent--contact-card-ribbon-16-regular]"},
        { title: "Cashback",src:"icon-[material-symbols--currency-exchange]"}
    ];

    return (
        <>
            <div className={` ${open ? "w-72" : "w-20"} bg-dark-purple h-screen p-5 pt-8 relative duration-200 bg-gray-100`}>
                <div className={`fixed left-0 pl-4 bg-gray-100 h-full duration-200 ${open ? "w-[255px]" : "w-[78px]"}`}>
                    <div onClick={() => setOpen(!open)} className="flex gap-x-4 items-center">
                        <img className="w-10" src="./img/dashboard/menu_icon.png"/>
                        <h1 className={`text-black origin-left font-medium text-xl duration-200 ${!open && "scale-0"}`}>VisitaEcuador.com</h1>
                    </div>
                    <ul className="pt-6">
                        {Menus.map((Menu, index) => (
                            <li
                                key={index}
                                onClick={() => changeMenu(index)}
                                className={`flex relative group  rounded-md p-2 cursor-pointer hover:bg-light-white text-black text-sm items-center gap-x-4  mt-2 ${index === 0 && "bg-light-white"} ${index==activo?"bg-gray-300":""} mr-4`}>
                                {(!open)&&<div className='absolute hidden group-hover:block  ml-12 rounded-md bg-green-900 p-2 text-white font-semibold'>{Menu.title}</div>}
                                <span class={`${Menu.src} h-7 w-7 text-green-900`}></span>
                                <span className={`${!open && "hidden"} origin-left duration-200`}>
                                    {Menu.title}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Navbar;