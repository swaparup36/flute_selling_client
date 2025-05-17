import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';

const prisma = new PrismaClient();

interface userJWTpayload extends JwtPayload {
    id: string
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        console.log("payment successful: ", body);
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

        const { shippingDetails, items } = body;

        if (!shippingDetails || !items) {
            return NextResponse.json({
                success: false,
                message: "Shipping details or items not found"
            });
        }

        const order = await prisma.order.create({
            data: {
                buyer_firstName: shippingDetails.firstName,
                buyer_lastname: shippingDetails.lastName,
                buyer_email: shippingDetails.email,
                buyer_address: shippingDetails.address,
                buyer_city: shippingDetails.city,
                buyer_phone: shippingDetails.phone,
                buyer_pincode: shippingDetails.pincode,
                buyer_state: shippingDetails.state,
                total_quantity: body.total_quantity,
                total_price: body.total_price,
                userId: id,
                payment_method: shippingDetails.paymentMethod
            }
        });

        for (const item of items) {
            await prisma.orderItem.create({
                data: {
                    productId: item.id,
                    orderId: order.id,
                    name: item.name,
                    price: item.discountedPrice,
                    quantity: item.quantity ? item.quantity : 1,
                    image: item.images[0],
                    ...(item.thread_one && { thread_one: item.thread_one }),
                    ...(item.thread_two && { thread_two: item.thread_two }),
                    ...(item.name_on && { name_on: item.name_on })
                }
            });

            await prisma.cart.deleteMany({
                where: {
                    userId: id,
                    productId: item.id
                }
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