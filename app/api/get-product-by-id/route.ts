import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest){
    const body = await req.json();
    try {
        const requiredProduct = await prisma.product.findUnique({
            where: {
                id: body.id
            }
        });

        const reviews = await prisma.review.findMany({
            where: {
                productId: body.id
            }
        })

        if(!requiredProduct) {
            return NextResponse.json({
                success: false,
                message: 'no product found with the given id'
            });
        }

        const images = await prisma.productImage.findMany({
            where: {
                productId: requiredProduct.id
            }
        });

        // @ts-ignore
        requiredProduct.images = images.map((image) => image.url);

        return NextResponse.json({
            success: true,
            requiredProduct: requiredProduct,
            reviews: reviews || []
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}