import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { sendMail } from "@/utils/mailer";

dotenv.config();
const prisma = new PrismaClient();

export async function POST(req: NextRequest){
    const body = await req.json();
    try {
        console.log("body: ", body);

        const OTP = Math.floor(100000 + Math.random() * 900000);

        const OtpType = body.type;

        if (OtpType !== 'signup' && OtpType !== 'forgot-password') {
            return NextResponse.json({
                success: false,
                message: 'Invalid OTP type'
            });
        }

        if (OtpType === 'signup') {
            const sendMailResponse = await sendMail({
                email: process.env.SMTP_SERVER_USERNAME || 'crampusgaming@gmail.com',
                sendTo: body.email,
                subject: 'OTP verification',
                text: "",
                html: `
                    <!DOCTYPE html>
                    <html lang="en" style="margin:0; padding:0;">
                        <head>
                            <meta charset="UTF-8" />
                            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                            <title>Bakale's Flute OTP Verification</title>
                        </head>
                        <body style="margin:0; padding:0; background-color:#fff7ee; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:#333;">

                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fff7ee; padding: 40px 0;">
                                <tr>
                                <td align="center">
                                    <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#fff; border-radius:12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 40px;">
                                    <!-- Logo -->
                                    <tr>
                                        <td align="center" style="padding-bottom: 20px;">
                                            <img src="https://flute-selling-client.vercel.app/_next/image?url=%2Flogo.png&w=640&q=75" alt="Bakale's Flute Logo" style="Width: 150px; height: auto;"/>
                                        </td>
                                    </tr>

                                    <!-- Greeting -->
                                    <tr>
                                        <td style="text-align: center;">
                                        <h2 style="color:#222; font-size:24px; margin-bottom:10px;">Verify Your Email</h2>
                                        <p style="font-size:16px; color:#555;">Thank you for signing up with <strong>Bakale's Flute</strong>! To complete your registration, please use the OTP below:</p>
                                        </td>
                                    </tr>

                                    <!-- OTP Code Box -->
                                    <tr>
                                        <td align="center" style="padding: 30px 0;">
                                        <div style="display:inline-block; background-color:#fef2dc; padding: 20px 40px; border-radius: 10px; border: 1px dashed #b8860b; font-size: 32px; font-weight: bold; color: #b8860b; letter-spacing: 5px;">
                                            ${OTP}
                                        </div>
                                        </td>
                                    </tr>

                                    <!-- Instructions -->
                                    <tr>
                                        <td style="text-align: center;">
                                        <p style="font-size:14px; color:#777;">Enter this OTP to verify your email address. This code is valid for the next 10 minutes.</p>
                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="text-align: center; font-size:12px; color:#aaa; padding-top: 30px;">
                                        If you did not sign up for Bakale's Flute, please ignore this email.
                                        <br/><br/>
                                        &copy; 2025 Bakale's Flute. All rights reserved.
                                        </td>
                                    </tr>

                                    </table>
                                </td>
                                </tr>
                            </table>

                        </body>
                    </html>
                `
            });
            if (!sendMailResponse.success) {
                return NextResponse.json({
                    success: false,
                    message: 'Unable send otp'
                });
            }
        } else {
            const existingUser = await prisma.user.findUnique({
                where: {
                    email: body.email
                }
            });
            if (!existingUser) {
                return NextResponse.json({
                    success: false,
                    message: `User not found`
                })
            }

            const sendMailResponse = await sendMail({
                email: process.env.SMTP_SERVER_USERNAME || 'crampusgaming@gmail.com',
                sendTo: body.email,
                subject: 'OTP verification',
                text: "",
                html: `
                    <!DOCTYPE html>
                    <html lang="en" style="margin:0; padding:0;">
                        <head>
                            <meta charset="UTF-8" />
                            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                            <title>Bakale's Flute Password Reset</title>
                        </head>
                        <body style="margin:0; padding:0; background-color:#fff7ee; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:#333;">

                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fff7ee; padding: 40px 0;">
                                <tr>
                                <td align="center">
                                    <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#fff; border-radius:12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 40px;">
                                    
                                    <!-- Logo -->
                                    <tr>
                                        <td align="center" style="padding-bottom: 20px;">
                                            <img src="https://flute-selling-client.vercel.app/_next/image?url=%2Flogo.png&w=640&q=75" alt="Bakale's Flute Logo" style="Width: 150px; height: auto;"/>
                                        </td>
                                    </tr>

                                    <!-- Heading -->
                                    <tr>
                                        <td style="text-align: center;">
                                        <h2 style="color:#222; font-size:24px; margin-bottom:10px;">Reset Your Password</h2>
                                        <p style="font-size:16px; color:#555;">We received a request to reset your password. Use the OTP below to continue:</p>
                                        </td>
                                    </tr>

                                    <!-- OTP Code Box -->
                                    <tr>
                                        <td align="center" style="padding: 30px 0;">
                                        <div style="display:inline-block; background-color:#fef2dc; padding: 20px 40px; border-radius: 10px; border: 1px dashed #b8860b; font-size: 32px; font-weight: bold; color: #b8860b; letter-spacing: 5px;">
                                            ${OTP}
                                        </div>
                                        </td>
                                    </tr>

                                    <!-- Instructions -->
                                    <tr>
                                        <td style="text-align: center;">
                                        <p style="font-size:14px; color:#777;">Enter this OTP to reset your password. It will expire in 10 minutes.</p>
                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="text-align: center; font-size:12px; color:#aaa; padding-top: 30px;">
                                        If you didn’t request a password reset, you can safely ignore this email.
                                        <br/><br/>
                                        &copy; 2025 Bakale's Flute. All rights reserved.
                                        </td>
                                    </tr>

                                    </table>
                                </td>
                                </tr>
                            </table>

                        </body>
                    </html>

                `
            });
            if (!sendMailResponse.success) {
                return NextResponse.json({
                    success: false,
                    message: 'Unable send otp'
                });
            }
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