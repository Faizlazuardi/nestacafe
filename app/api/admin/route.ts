import { getTotalMaterials } from "@/services/material.service";
import { getSoldProducts, getTotalProducts } from "@/services/product.service";
import { getTotalRevenue } from "@/services/transaction.service";
import { parseTimeRange } from "@/utils/time-range";

export async function GET(req: Request): Promise<Response> {
    const { searchParams } = new URL(req.url);
    const time = parseTimeRange(searchParams.get('time'));

    try {
        const [products, totalProduct, totalMaterial, totalRevenue] =
            await Promise.all([
                getSoldProducts(time),
                getTotalProducts(),
                getTotalMaterials(),
                getTotalRevenue(time),
            ]);
        const parsedData = {
            products, 
            summary: {
                product:totalProduct,
                material:totalMaterial,
                revenue:totalRevenue
            }
        }
        return new Response(JSON.stringify(parsedData), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}