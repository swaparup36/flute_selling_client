import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export async function GET(req: NextRequest){
    try {
        const adminSecret = req.headers.get('AdminSecret');
        if (adminSecret !== process.env.ADMIN_SECRET) {
            return NextResponse.json({
                success: false,
                message: 'Admin secret is not valid'
            });
        }

        const orders = await prisma.order.findMany();

        const ordersWithItems = [];
        for (const order of orders) {
            const orderItems = await prisma.orderItem.findMany({
                where: {
                    orderId: order.id
                }
            });
            
            const orderWithItems = {
                order: order,
                orderItems: orderItems
            }

            ordersWithItems.push(orderWithItems);
        }

        return NextResponse.json({
            success: true,
            ordersWithItems: ordersWithItems
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}