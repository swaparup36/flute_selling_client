import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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

        if (existingUser) {
            return NextResponse.json({
                success: false,
                message: 'User already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);

        const user = await prisma.user.create({
            data: {
                email: body.email,
                password: hashedPassword,
                name: body.name,
            }
        });

        if (!process.env.JWT_SECRET) {
            return NextResponse.json({
                success: false,
                message: 'JWT secret is missing'
            });
        }

        const token = jwt.sign({ id: user.id}, process.env.JWT_SECRET as string );

        return NextResponse.json({
            success: true,
            token: token
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}