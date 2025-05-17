import { NextRequest, NextResponse } from "next/server";
import * as dotenv from 'dotenv';
import { sendMail } from "@/utils/mailer";

dotenv.config();

export async function POST(req: NextRequest){
    const body = await req.json();
    try {
        console.log("body: ", body);

        const OTP = Math.floor(100000 + Math.random() * 900000);

        const sendMailResponse = await sendMail({
            email: process.env.SMTP_SERVER_USERNAME || 'crampusgaming@gmail.com',
            sendTo: body.email,
            subject: 'OTP verification',
            text: `Your OTP is ${OTP}`
        });

        if (!sendMailResponse.success) {
            return NextResponse.json({
                success: false,
                message: 'Unable send otp'
            });
        }

        return NextResponse.json({
            success: true,
            otp: OTP.toString()
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}