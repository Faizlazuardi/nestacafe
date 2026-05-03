"use client"

import { useModals } from "@/hooks/useModals";
import { Transaction } from "../types"; 
import { formatIDR } from "@/lib/utils/formatIDR";
import { useState } from "react";
import TransactionModal from "../components/modal/transactionModal";

export default function TransactionPage({transactions}: {transactions: Transaction[]}) {
    const {modals:transactionModal, open: handleOpenTransactionModal, close:handleCloseTransactionModal} = useModals()
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
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
                                            onClick={() => {
                                                setSelectedTransaction(transaction);
                                                handleOpenTransactionModal();
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
                    <TransactionModal transaction={selectedTransaction!} onCloseTransactionModal={handleCloseTransactionModal}/>
                )
            }
        </>
    );
}