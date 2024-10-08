import { React, useState } from "react";
import TopMenu from "./TopMenu";
import Sidebar, { SidebarItem } from "./SideNav";
import { HomeIcon, CalendarIcon } from "@heroicons/react/outline"; 
import Dashboard from "./Dashboard";
import Calendar from "./Calendar";

const Layout = ({ groupID }) => {
  const [currentView, setCurrentView] = useState("Dashboard");

  return (
    <div className={`min-w-full min-h-screen ${currentView === "Dashboard" ? "bg-blue-100" : "bg-white-100"}`}>
        <div className="flex">
          <Sidebar>
            <SidebarItem text="Dashboard" icon={HomeIcon} changeView={() => setCurrentView("Dashboard")}/>
            <SidebarItem text="Date" icon={CalendarIcon} changeView={() => setCurrentView("Calendar")}/>
          </Sidebar>
          <div className="w-full overflow-x-auto">
            {currentView === "Dashboard" && <Dashboard groupID={groupID}></Dashboard>}
            {currentView === "Calendar" && <Calendar groupID={groupID}></Calendar>}
          </div>
        </div>
    </div>
  );
};

export default Layout;
