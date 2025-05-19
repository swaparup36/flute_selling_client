import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';

const prisma = new PrismaClient();

interface userJWTpayload extends JwtPayload {
    id: string
}

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

        const allCarts = await prisma.cart.findMany({
            where: {
                userId: id
            }
        });

        const products = [];
        for (const cart of allCarts) {
            const product = await prisma.product.findUnique({
                where: {
                    id: cart.productId
                }
            });

            if (product) {
                products.push(product);
            }
        }

        for (const product of products) {
            const images = await prisma.productImage.findMany({
                where: {
                    productId: product.id
                }
            });
            // @ts-ignore
            product.images = images.map((image) => image.url);
        }

        return NextResponse.json({
            success: true,
            products: products
        });        
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}