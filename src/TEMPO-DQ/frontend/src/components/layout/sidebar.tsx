import Link from "next/link";
import {
  LayoutDashboard,
  Database,
  BookOpen,
  Settings,
  User,
  HelpCircle,
} from "lucide-react";

import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Overview", icon: LayoutDashboard, href: "/dashboard/overview" },
  { name: "Data Quality", icon: Database, href: "/dashboard/data-quality" },
  { name: "Courses", icon: BookOpen, href: "/dashboard/courses" },
  { name: "User", icon: BookOpen, href: "/dashboard/users" },
];

const bottomItems = [
  { name: "Settings", icon: Settings, href: "dashboard/settings" },
  { name: "Accounts", icon: User, href: "dashboard/accounts" },
  { name: "Help", icon: HelpCircle, href: "dashboard/help" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-[#262626] border-0 flex flex-col py-6 text-zinc-400 shadow-xxl shadow-black/30  ">
      {/* Logo Area */}
      <div className="mb-10 text-white text-xl font-bold px-6">
        LMS Dashboard
      </div>

      {/* Main Menu */}
      <div className="space-y-6 ">
        <div>
          <h3 className="text-xs uppercase px-6 tracking-wider mb-4 font-semibold text-zinc-600">
            Overview
          </h3>
          <nav className="space-y-2 ">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-6 gap-3 py-2 rounded-0 hover:bg-zinc-900 hover:text-primary hover:bg-[#FFFCE6]/10 hover:text-black"
                style={{
                  background: pathname == item.href ? "#3c3b39" : "transparent",
                  font: pathname == item.href ? "bold" : "normal",
                }}
              >
                <item.icon size={20} className="text-[#A3B79C]" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Others Menu */}
        <div>
          <h3 className="text-xs uppercase px-6 tracking-wider mb-4 font-semibold text-zinc-600">
            Others
          </h3>
          <nav className="space-y-2">
            {bottomItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-6 py-2 rounded-lg hover:bg-zinc-900 hover:text-white transition-colors"
              >
                <item.icon size={20} className="text-[#A3B79C]" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
