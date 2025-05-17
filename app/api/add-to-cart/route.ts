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
        console.log("body: ", body);

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

        const product = await prisma.product.findUnique({
            where: {
                id: body.productId
            }
        });

        if (!product) {
            return NextResponse.json({
                success: false,
                message: "No such product found"
            });
        }

        const existingCart = await prisma.cart.findFirst({
            where: {
                productId: product.id,
                userId: id
            }
        });

        if (existingCart) {
            return NextResponse.json({
                success: false,
                message: "Product already in cart"
            });
        }

        const cart = await prisma.cart.create({
            data: {
                userId: id,
                productId: product.id,
            }
        });

        const allCarts = await prisma.cart.findMany({
            where: {
                userId: id
            }
        });

        return NextResponse.json({
            success: true,
            cart: cart,
            cartsCount: allCarts.length
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}