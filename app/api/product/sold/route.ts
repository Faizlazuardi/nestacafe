import { getSoldProducts } from "@/services/product.service";

export async function GET(req: Request): Promise<Response> {
    const { searchParams } = new URL(req.url);
    const timeParam:any = searchParams.get('time') ?? 'Hari';
    const time: 'Hari' | 'Bulan' | 'Tahun' =
        timeParam === 'Hari' || timeParam === 'Bulan' || timeParam === 'Tahun'
        ? timeParam
        : 'Hari';
    try {
        const products = await getSoldProducts(timeParam);
        return new Response(JSON.stringify(products), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}