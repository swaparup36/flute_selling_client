import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface userJWTpayload extends JwtPayload {
    id: string
}

const prisma = new PrismaClient();

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


        const existingWishlist = await prisma.wishlist.findFirst({
            where: {
                productId: body.productId,
                userId: id
            }
        });

        if(!existingWishlist) {
            return NextResponse.json({
                success: false,
                message: 'no product found on the wishlist with the given id'
            });
        }

        await prisma.wishlist.delete({
            where: {
                id: existingWishlist.id
            }
        });

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