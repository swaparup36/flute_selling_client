import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request){
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const skip = (page - 1) * limit;
    try {
        let allProducts;
        console.log("category: ", category);
        if(category === 'all' || category === '' || category === null){
            allProducts = await prisma.product.findMany({
                skip,
                take: limit
            });
        } else {
            allProducts = await prisma.product.findMany({
                where: {
                    category: category
                },
                skip,
                take: limit
            });
        }

        for (const product of allProducts) {
            const images = await prisma.productImage.findMany({
                where: {
                    productId: product.id
                }
            });
            // @ts-ignore
            product.images = images.map((image) => image.url);
        }

        return NextResponse.json({
            success: true,
            allProducts: allProducts || []
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}