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

        await prisma.productImage.deleteMany({
            where: {
                productId: existingProduct.id
            }
        });

        const updatedProduct = await prisma.product.update({
            data: {
                name: body.name,
                category: body.category,
                description: body.description,
                price: body.price,
                discountedPrice: body.discountedPrice,
            },
            where: {
                id: body.id
            }
        });

        for (const image of body.images) {
            const newImage = await prisma.productImage.create({
                data: {
                    url: image,
                    productId: updatedProduct.id
                }
            });
        }

        // @ts-ignore
        updatedProduct.images = body.images;

        return NextResponse.json({
            success: true,
            updatedProduct: updatedProduct
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}