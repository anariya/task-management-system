import { ChevronLeftIcon } from "@heroicons/react/outline"
import React, { Children, useState } from "react"

export default function Sidebar({ children }) {
    const [isSidebarToggled, setSidebarToggle] = useState(true);
    
    const toggleSidebar = () => {
        setSidebarToggle(!isSidebarToggled);
    };
    
    return(
        <aside className={`h-screen transition-width duration-300 ${isSidebarToggled ? "w-64" : "w-16"} bg-white border-r shadow-sm`}>
            <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                <div className="p-4 pb-2 flex justify-between items-center">
                    <img src="" className="w-32" alt="" />
                    <button className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 w-5 h-5" onClick={toggleSidebar}>
                        <ChevronLeftIcon />
                    </button>
                </div>
                
                <ul className="flex-1 px-3">
                    {React.Children.map(children, (child) => (
                        <SidebarItem {...child.props} isSidebarToggled={isSidebarToggled} />
                    ))}
                </ul>
            </nav>
        </aside>
    )
}

export function SidebarItem({text, changeView, icon: Icon, isSidebarToggled}) {
    return (
        <li className="flex items-center py-2">
            <a className="flex items-center" onClick={(changeView)}>
                <Icon className="h-6 w-6 transition-opacity duration-300"/>
                <span className={`transition-opacity duration-300 ${isSidebarToggled ? "opacity-100" : "opacity-0"} ml-2`}>
                    {text}
                </span>
            </a>
        </li>
    );
}