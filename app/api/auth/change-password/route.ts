import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

export async function POST(req: NextRequest){
    const body = await req.json();
    try {
        console.log("body: ", body);
        const existingUser = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        });

        if (!existingUser) {
            return NextResponse.json({
                success: false,
                message: 'User not found'
            });
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);

        const updateUser = await prisma.user.update({
            where: {
                email: body.email
            },
            data: {
                password: hashedPassword
            }
        });

        return NextResponse.json({
            success: true,
            user: updateUser
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}