import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest){
    const body = await req.json();
    try {
        const existingProduct = await prisma.product.findUnique({
            where: {
                id: body.id
            }
        });

        if(!existingProduct) {
            return NextResponse.json({
                success: false,
                message: 'no product found with the given id'
            });
        }

        await prisma.review.deleteMany({ where: { productId: body.id } });
        await prisma.orderItem.deleteMany({ where: { productId: body.id } });
        await prisma.cart.deleteMany({ where: { productId: body.id } });
        await prisma.wishlist.deleteMany({ where: { productId: body.id } });
        await prisma.productImage.deleteMany({ where: { productId: body.id } });

        console.log("Product Id: ", body.id);
        await prisma.product.delete({
            where: {
                id: body.id
            }
        })

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}