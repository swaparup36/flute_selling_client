import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(){
    try {
        const allProducts = await prisma.product.findMany();
        const featureProducts = allProducts.slice(0, 4);

        return NextResponse.json({
            success: true,
            featureProducts: featureProducts || []
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}