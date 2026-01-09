"use client"

import { useModals } from "@/hooks/useModals";
import { Transaction } from "@/types/transaction";
import { formatIDR } from "@/utils/formatIDR";
import { useEffect, useState } from "react";
import TransactionModal from "../components/modal/transactionModal";

export default function TransacttionPage() {
    const [transactions, setTransactions] = useState<Transaction[] | null>(null)
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
    const {modals:transactionModal, open: handleOpenTransactionModal, close:handleCloseTransactionModal} = useModals()
    useEffect(() => {
        const fetchTransaction = async () => {
            const res = await fetch('/api/transaction')
            const data = await res.json()
            setTransactions(data)
        }
        fetchTransaction()
    },[])
    
    return (
        <>
            <h1 className="font-bold text-2xl">Transaksi</h1>
            <table className="bg-white w-full">
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
                    {
                        transactions?.map((transaction: Transaction) => {
                            return (
                                <tr key={transaction.id}>
                                    <td className="p-4 h-full">{transaction.id}</td>
                                    <td className="p-4 h-full">{new Date(transaction.createdAt).toLocaleString()}</td>
                                    <td className="p-4 h-full">{transaction.cashier.name}</td>
                                    <td className="p-4 h-full">{formatIDR(transaction.total)}</td>
                                    <td className="flex justify-center p-4 h-full">
                                        <button 
                                            className="shadow px-4 py-1 rounded-md hover:cursor-pointer button-primary" 
                                            onClick={()=>{
                                                setSelectedTransaction(transaction)
                                                handleOpenTransactionModal()
                                            }}
                                        >
                                            Detail
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            {
                transactionModal && (
                    <TransactionModal selectedTransaction={selectedTransaction!} onCloseTransactionModal={handleCloseTransactionModal}/>
                )
            }
        </>
    );
}