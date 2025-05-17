import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest){
    const body = await req.json();
    try {
        console.log("body: ", body);
        const existingReview = await prisma.review.findUnique({
            where: {
                id: body.id
            }
        });

        if(!existingReview) {
            return NextResponse.json({
                success: false,
                message: 'no review found with the given id'
            });
        }

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

        const newRating = (existingProduct.rating + (existingProduct.rating - body.rating)).toFixed(1);

        const updatedProduct = await prisma.product.update({
            where: {
                id: body.productId
            },
            data: {
                rating: parseFloat(newRating)
            }
        });

        await prisma.review.delete({
            where: {
                id: body.id
            }
        });

        const updatedReviews = await prisma.review.findMany({
            where: {
                productId: body.productId
            }
        })

        return NextResponse.json({
            success: true,
            updatedProduct: updatedProduct,
            updatedReviews: updatedReviews
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}