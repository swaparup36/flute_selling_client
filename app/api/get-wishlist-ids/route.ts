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

        const allWishlists = await prisma.wishlist.findMany({
            where: {
                userId: id
            }
        });

        const productIds = [];
        for (const wishlist of allWishlists) {
            productIds.push(wishlist.productId);
        }

        return NextResponse.json({
            success: true,
            productIds: productIds
        });        
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}