"use client"

import { TIME_RANGES } from "@/utils/date";
import { formatIDR } from "@/utils/formatIDR";
import { Coffee, DollarSign, Box, ChevronDown, ChevronUp } from "lucide-react"
import { useEffect, useState } from "react"

interface productSold {
    id: string,
    name: string,
    image: string,
    totalQuantity: number,
}

export default function DashboardPage() {
    const [productSold, setProductSold] = useState<productSold[]>([])
    const [filterTime, setFilterTime] = useState<string>(TIME_RANGES[0])
    const [dropdown, setDropdown] = useState<boolean>(false);
    const [summary, setSummary] = useState<{ product: number, material: number, revenue: number}>()
    
    const toggleDropdown = () => {
        setDropdown(!dropdown)
    }
    
    useEffect(() => {
        const fetchSoldProduct = async () => {
            try {
                const res = await fetch(`/api/admin?time=${filterTime}`);
                const data = await res.json();
                setProductSold(data.products);
                setSummary(data.summary)
            } catch (error) {
                console.error(error)
            }
        }
        fetchSoldProduct();
    }, [filterTime])

    return (
        <>
            <h1 className="font-bold text-3xl">Dashboard</h1>
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-10">
                    <div className="flex flex-col flex-1 gap-2 p-4 rounded-2xl button-primary">
                        <Coffee className="bg-(--brand-50) p-2 rounded-lg w-fit h-fit text-(--brand-500)" />
                        <span className="text-xl">Total Produk</span>
                        <span className="text-lg">{summary?.product}</span>
                    </div>
                    <div className="flex flex-col flex-1 gap-2 p-4 rounded-2xl button-primary">
                        <DollarSign className="bg-(--brand-50) p-2 rounded-lg w-fit h-fit text-(--brand-500)" />
                        <span className="text-xl">Total Bahan Baku</span>
                        <span className="text-lg">{summary?.material}</span>
                    </div>
                    <div className="flex flex-col flex-1 gap-2 p-4 rounded-2xl button-primary">
                        <Box className="bg-(--brand-50) p-2 rounded-lg w-fit h-fit text-(--brand-500)" />
                        <span className="text-xl">Total Pendapatan</span>
                        <span className="text-lg">{formatIDR(summary?.revenue ?? 0)}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-8 bg-white p-6 rounded-2xl w-full">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-2xl">Produk Terlaris</span>
                        <div className="relative flex-flex-col w-30">
                            <div className="flex justify-between items-center p-2 border rounded-md" onClick={toggleDropdown}>
                                <span className="font-bold text-xl">{filterTime}</span>
                                {dropdown ? <ChevronUp /> : <ChevronDown />}
                            </div>
                            <ul className={`absolute flex flex-col gap-1 py-1 w-full bg-white shadow-md rounded-md font-bold text-lg ${!dropdown && 'hidden'}`}>
                                {
                                    TIME_RANGES.map(item => (
                                        <li key={item} 
                                            className="hover:bg-gray-100 active:bg-gray-200 p-2" 
                                            onClick={() => {
                                                setFilterTime(item)
                                                toggleDropdown()
                                            }}>{item}</li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 w-full">
                        {
                            productSold.map((item) => (
                                <div key={item.id} className="flex justify-between bg-(--brand-50) border border-(--brand-500) p-4 rounded-lg items-center">
                                    <div className="flex items-center gap-4">
                                        <img src={item.image} alt={item.name} height={32} width={32} />
                                        <span className="font-medium text-2xl">{item.name}</span>
                                    </div>
                                    <span className="text-lg text-(--brand-500) font-semibold">{item.totalQuantity} Terjual</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}