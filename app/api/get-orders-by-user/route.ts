import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface userJWTpayload extends JwtPayload {
    id: string
}

const prisma = new PrismaClient();

export async function GET(req: NextRequest){
    try {
        const token = req.headers.get('AuthToken');
        if (!token) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized 401"
            });
        }

        const decodedToken = jwt.decode(token) as userJWTpayload;
        console.log("decoded token: ", decodedToken);
        const { id } = decodedToken;

        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "No user found"
            });
        }

        const orders = await prisma.order.findMany({
            where: {
                userId: id
            }
        });

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