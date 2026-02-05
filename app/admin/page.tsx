"use client"

import { TIME_RANGES } from "@/lib/utils/date";
import { formatIDR } from "@/lib/utils/formatIDR";
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
    const [summary, setSummary] = useState<{ product: number, material: number, revenue: number}>()
    
    
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
                        <div className="inline-block relative">
                            <select
                                className="px-4 py-2 pr-10 font-bold text-xl appearance-none cursor-pointer"
                                onChange={(e) => setFilterTime(e.target.value)}
                            >
                                {TIME_RANGES.map((item) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>
                                ))}
                            </select>

                            <ChevronDown
                                size={20}
                                className="top-1/2 right-2 absolute text-gray-500 -translate-y-1/2 pointer-events-none"
                            />
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