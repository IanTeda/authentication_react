// import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import React from "react";

export type AppMenuItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
};

export interface NavbarProps {
  app_menu_items: AppMenuItem[];
}

const Navbar = ({ app_menu_items }: NavbarProps) => {
  return (
    <React.Fragment>
      <div className="text-lg font-semibold">Authentication Service</div>
      <div className="space-x-4">
        {app_menu_items.map((item) => (
          <Link to={item.url} key={item.title}>
            {item.title}
          </Link>
        ))}
      </div>
    </React.Fragment>
  );
};

export default Navbar;
