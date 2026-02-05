import { purchasedProduct } from "@/types/product";
import { Transaction } from "@/types/transaction";
import { formatIDR } from "@/lib/utils/formatIDR";
import { Calendar, DollarSign, User, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function TransactionModal({
    selectedTransaction,
    onCloseTransactionModal
}: {
    selectedTransaction: Transaction;
    onCloseTransactionModal: ()=> void
}){
    const [purchasedProducts, setPurchasedProducts] = useState<purchasedProduct[] | null>(null)
    useEffect(()=>{
        if (!selectedTransaction) return;
        const fetchDetailTransaction = async () => {
            const res = await fetch(`/api/transaction/${selectedTransaction!.id}`)
            const data = await res.json()
            setPurchasedProducts(data)
        }
        fetchDetailTransaction()
    },[selectedTransaction])
    return(
        <div className="fixed inset-0 flex justify-center items-center bg-black/20">
            <div className="flex flex-col items-center bg-white rounded-2xl w-md max-h-8/10">
                <div className="flex bg-(--brand-500) text-white p-6 rounded-t-2xl justify-between items-center w-full">
                    <span className="font-bold text-2xl">Detail Transaksi</span>
                    <X onClick={onCloseTransactionModal}/>
                </div>
                <div className="flex flex-col gap-6 p-6 w-full overflow-auto">
                    <div className="flex flex-col gap-4 bg-gray-100 p-4 border border-gray-500 rounded-2xl">
                        <div className="flex flex-col gap-2">
                            <span className="font-bold">Informasi Transaksi</span>
                            <div className="flex items-center gap-2">
                                <Calendar/>
                                <div className="flex flex-col">
                                    <span>Tanggal</span>
                                    <span className="font-bold">{new Date(selectedTransaction.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <User/>
                                <div className="flex flex-col">
                                    <span>Kasir</span>
                                    <span className="font-bold">{selectedTransaction.cashier.name}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <DollarSign/>
                                <div className="flex flex-col">
                                    <span>Metode Pembayaran</span>
                                    <span className="font-bold">{selectedTransaction.paymentType}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 bg-gray-100 p-4 border border-gray-500 rounded-2xl">
                        <span className="font-bold">Daftar Item</span>
                        {
                            purchasedProducts?.map(product => (
                                <div key={product.id} className="flex flex-col gap-2 bg-white p-4 border border-gray-500 rounded-lg">
                                    <div className="flex justify-between gap-2">
                                        <span className="font-bold">{product.name} {product.option}</span>
                                        <span>{formatIDR(product.subtotal)}</span>
                                    </div>
                                    <span>{product.quantity} x {formatIDR(product.price)}</span>
                                </div>
                            ))
                        }
                    </div>                    
                    <button
                        className="px-6 py-3 rounded-md w-full hover:cursor-pointer button-primary"
                        onClick={onCloseTransactionModal}
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    )
}