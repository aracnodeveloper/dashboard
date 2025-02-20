// eslint-disable-next-line no-unused-vars
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
        <div className={`${open ? "w-72" : "w-20"} h-screen flex-shrink-0 fixed left-0 z-20`}>
            <div className={`h-full bg-gray-100 duration-200 ${open ? "w-[255px]" : "w-[78px]"} p-5 pt-8`}>
                <div onClick={() => setOpen(!open)} className="flex gap-x-4 items-center cursor-pointer">
                    <img className="w-10" src="./img/dashboard/menu_icon.png" alt="menu"/>
                    <h1 className={`text-black origin-left font-medium text-xl duration-200 ${!open && "scale-0"}`}>
                        VisitaEcuador.com
                    </h1>
                </div>
                <ul className="pt-6">
                    {Menus.map((Menu, index) => (
                        <li
                            key={index}
                            onClick={() => changeMenu(index)}
                            className={`flex relative group rounded-md p-2 cursor-pointer hover:bg-light-white text-black text-sm items-center gap-x-4 mt-2 
                                ${index === activo ? "bg-gray-300" : ""} mr-4`}
                        >
                            {(!open) && (
                                <div className='absolute hidden group-hover:block left-full ml-2 rounded-md bg-green-900 p-2 text-white font-semibold whitespace-nowrap z-50'>
                                    {Menu.title}
                                </div>
                            )}
                            <div className="w-10 h-10 flex items-center justify-center">
                                <span className={`${Menu.src} h-7 w-7 text-green-900`}></span>
                            </div>
                            <span className={`${!open && "hidden"} origin-left duration-200`}>
                                {Menu.title}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
