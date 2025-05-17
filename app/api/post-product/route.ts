import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest){
    const body = await req.json();
    try {
        console.log("body: ", body);
        const newProduct = await prisma.product.create({
            data: {
                name: body.name,
                category: body.category,
                description: body.description,
                images: body.images,
                price: body.price,
                discountedPrice: body.discountedPrice,
                rating: 4,
            }
        });

        return NextResponse.json({
            success: true,
            newProduct: newProduct
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}