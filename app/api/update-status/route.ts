import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export async function POST(req: NextRequest){
    const body = await req.json();
    try {
        const adminSecret = req.headers.get('AdminSecret');
        if (adminSecret !== process.env.ADMIN_SECRET) {
            return NextResponse.json({
                success: false,
                message: 'Admin secret is not valid'
            });
        }

        const { orderId, status } = body;
        const order = await prisma.order.findUnique({
            where: {
                id: orderId
            }
        });

        if (!order) {
            return NextResponse.json({
                success: false,
                message: "Order not found"
            });
        }

        const updatedOrder = await prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                status: status
            }
        });

        return NextResponse.json({
            success: true,
            status: updatedOrder.status
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}