import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import React, { Children, useState } from "react";

export default function Sidebar({ children }) {
  const [isSidebarToggled, setSidebarToggle] = useState(true);

  const toggleSidebar = () => {
    setSidebarToggle(!isSidebarToggled);
  };

  return (
    <aside
      className={`h-screen transition-width duration-300 ${
        isSidebarToggled ? "w-64" : "w-16"
      } bg-white border-r shadow-sm`}
    >
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="relative">
          <button
            className="absolute top-8 right-[-30px] p-1.5 rounded-lg bg-gray-300 hover:bg-gray-100 w-6 h-6"
            onClick={toggleSidebar}
          >
            {isSidebarToggled ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </button>
        </div>

        <ul className="flex-1 px-3">
          {React.Children.map(children, (child) => (
            <SidebarItem {...child.props} isSidebarToggled={isSidebarToggled} />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export function SidebarItem({
  text,
  changeView,
  icon: Icon,
  isSidebarToggled,
  href,
  isActive,
}) {
  return (
    // Active component has a background colour, width of the border is reduced when collapsed
    <li
      className={`flex items-center py-2 hover:bg-blue-100 rounded-lg ${
        isActive ? "bg-blue-200 rounded-lg" : ""
      } ${isSidebarToggled ? "" : "w-7"}`}
    >
      {/* Added href prop for navigation back to groups screen */}
      <a
        className={`cursor-pointer flex items-center ${
          isSidebarToggled ? "" : "cursor-default"
        }`}
        onClick={changeView}
        href={href}
      >
        <Icon className="h-6 w-6 transition-opacity duration-300" />
        {/* Sidebar toggle disables opacity on the text and makes the expansion bubble clickable by setting width and height of the text to none. */}
        <span
          className={`transition ${
            isSidebarToggled ? "opacity-100" : "opacity-0 pointer-events-none"
          } ml-2`}
        >
          {text}
        </span>
      </a>
    </li>
  );
}
