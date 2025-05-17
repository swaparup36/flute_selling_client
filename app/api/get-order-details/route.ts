import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';

const prisma = new PrismaClient();

interface userJWTpayload extends JwtPayload {
    id: string
}

export async function POST(req: NextRequest){
    const body = await req.json();

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

        const { orderId } = body;
        const order = await prisma.order.findUnique({
            where: {
                id: orderId,
                userId: id
            }
        });

        if (!order) {
            return NextResponse.json({
                success: false,
                message: "Order not found"
            }); 
        }

        const orderItems = await prisma.orderItem.findMany({
            where: {
                orderId: order.id
            }
        });

        const orderWithItems = {
            order: order,
            orderItems: orderItems
        }

        return NextResponse.json({
            success: true,
            orderWithItems: orderWithItems
        });        
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}