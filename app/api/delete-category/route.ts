import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest){
    const body = await req.json();
    try {
        console.log("body: ", body);
        const existingCategory = await prisma.categories.findUnique({
            where: {
                id: body.categoryId
            }
        });

        if(!existingCategory) {
            return NextResponse.json({
                success: true,
                message: "No such category found"
            });
        }

        await prisma.categories.delete({
            where: {
                id: body.categoryId
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