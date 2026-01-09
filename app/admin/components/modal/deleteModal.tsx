import { MaterialUsage, Product, ProductVariant } from "@/types/product";
import { Trash2 } from "lucide-react";

export default function DeleteModal({ data }: { data: Product | ProductVariant | MaterialUsage }) {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/20">
            <div className="flex flex-col justify-center bg-white rounded-lg w-fit h-fit">
                <Trash2 />
            </div>
        </div>
    )
}