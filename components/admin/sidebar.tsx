"use client";

import { LayoutDashboard, Coffee, FileChartColumn, Package, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
    { href: "/admin", name: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/produk", name: "Produk", icon: Coffee },
    { href: "/admin/transaksi", name: "Transaksi", icon: FileChartColumn },
    { href: "/admin/bahan-baku", name: "Bahan Baku", icon: Package },
    { href: "/admin/karyawan", name: "Karyawan", icon: User },
];

export default function Sidebar() {
    const pathname = usePathname();
    
    return (
        <nav className="flex flex-col gap-4 p-6 w-2/9 h-full sidebar">
            {menu.map(({ href, name, icon: Icon }) => (
                <Link
                key={href}
                href={href}
                className={`
                    flex gap-2 p-3 rounded-sm md:rounded-md lg:rounded-lg font-bold text-sm md:text-base lg:text-xl
                    ${pathname === href ? "sidebar-active" : "sidebar"}
                `}
                >
                <Icon className="w-4 md:w-5 lg:w-6 h-fit" />
                {name}
                </Link>
            ))}
        </nav>
    );
}
