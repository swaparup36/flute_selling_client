import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';

const prisma = new PrismaClient();

interface userJWTpayload extends JwtPayload {
    id: string
}

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

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

        const { items } = body;

        for (const item of items) {
            if (!item.instock) {
                return NextResponse.json({
                    success: false,
                    message: "Item is out of stock",
                    item: item.name
                });
            }
        }

        // Create option for Razorpay order
        const options = {
            amount: body.amount, // amount in smallest currency unit
            currency: "INR",
            receipt: "receipt_order_74394",
        };

        const order = await instance.orders.create(options);

        if (!order) {
            return NextResponse.json({
                success: false,
                message: "Some error occured"
            });
        }

        return NextResponse.json({
            success: true,
            order: order
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}