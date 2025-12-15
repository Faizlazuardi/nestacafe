import { Coffee, DollarSign, Box } from "lucide-react"

export default function DashboardPage() {
    return (
        <>
            <h1 className="font-bold text-2xl">Dashboard</h1>
            <div className="flex flex-col gap-4 overflow-y-scroll">
                <div className="flex flex-wrap gap-10">
                    <div className="flex flex-col flex-1 gap-2 p-4 rounded-2xl">
                        <Coffee className="bg-[#FEE2E2] p-2 rounded-lg w-fit h-fit text-[#E50000]"/>
                        <span className="text-xl">Total Produk</span>
                        <span className="text-lg">5</span>
                    </div>
                    <div className="flex flex-col flex-1 gap-2 p-4 rounded-2xl">
                        <DollarSign className="bg-[#FEE2E2] p-2 rounded-lg w-fit h-fit text-[#E50000]"/>
                        <span className="text-xl">Total Bahan Baku</span>
                        <span className="text-lg">5</span>
                    </div>
                    <div className="flex flex-col flex-1 gap-2 p-4 rounded-2xl button-primary">
                        <Box className="bg-[#FEE2E2] p-2 rounded-lg w-fit h-fit text-[#E50000]"/>
                        <span className="text-xl">Total Pendapatan</span>
                        <span className="text-lg">5</span>
                    </div>
                </div>
                <div className="">
                    
                </div>
            </div>
        </>
    )
}