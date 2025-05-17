import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest){
    const body = await req.json();
    try {
        console.log("body: ", body);
        const existingProduct = await prisma.product.findUnique({
            where: {
                id: body.productId
            }
        });

        if(!existingProduct) {
            return NextResponse.json({
                success: false,
                message: 'no product found with the given id'
            });
        }

        const newRating = ((existingProduct.rating + body.rating)/2).toFixed(1);

        const updatedProduct = await prisma.product.update({
            where: {
                id: body.productId
            },
            data: {
                rating: parseFloat(newRating)
            }
        })

        const newReview = await prisma.review.create({
            data: {
                author: body.author,
                content: body.content,
                date: new Date().toISOString(),
                rating: body.rating,
                productId: body.productId
            }
        });

        return NextResponse.json({
            success: true,
            newReview: newReview
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}