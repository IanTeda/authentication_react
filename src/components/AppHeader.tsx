//-- ./src/components/Header.tsx

import { BadgeCheck, LayoutDashboard } from "lucide-react";
import Navbar, { type AppMenuItem } from "./Navbar";

// # Application Header
//
// This is the application header component

const app_menu_items: AppMenuItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Account",
    url: "/account",
    icon: BadgeCheck,
  },
];

export function AppHeader() {
  return (
    <header className="w-full border-b">
      <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <Navbar app_menu_items={app_menu_items} />
      </nav>
    </header>
  );
}
