"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PenTool, User, Grid } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Tools", href: "/tools", icon: PenTool },
    { name: "Search", href: "/encyclopedia", icon: Search },
    { name: "Showcase", href: "/showcase", icon: Grid },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass-panel border-t border-white/10 backdrop-blur-xl bg-black/80 pb-safe">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                  isActive
                    ? "text-neon-blue"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${isActive ? "animate-pulse" : ""}`}
                />
                <span className="text-[10px] font-medium">{item.name}</span>
                {isActive && (
                  <div className="absolute bottom-0 w-8 h-0.5 bg-neon-blue rounded-t-full shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
