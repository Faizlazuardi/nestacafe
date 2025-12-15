export default function TransaksiPage() {
    return (
        <>
            <h1 className="font-bold text-2xl">Transaksi</h1>
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="p-4 text-xs md:text-sm lg:text-base">ID</th>
                        <th className="p-4 text-xs md:text-sm lg:text-base">Tanggal</th>
                        <th className="p-4 text-xs md:text-sm lg:text-base">Kasir</th>
                        <th className="p-4 text-xs md:text-sm lg:text-base">Total</th>
                        <th className="p-4 text-xs md:text-sm lg:text-base">Detail</th>
                    </tr>
                </thead>
                <tbody className="overflow-scroll">
                    {/* looping */}
                    <tr>
                        <td className="p-4 h-full">1</td>
                        <td className="p-4 h-full">2024-01-01</td>
                        <td className="p-4 h-full">John Doe</td>
                        <td className="p-4 h-full">Rp. 100.000</td>
                        <td className="flex justify-center p-4 h-full"><button className="shadow px-2 py-1 rounded-md hover:cursor-pointer button-primary">Detail</button></td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}