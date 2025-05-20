import { NextRequest, NextResponse } from "next/server";
import * as dotenv from 'dotenv';
import { sendMail } from "@/utils/mailer";

dotenv.config();

export async function POST(req: NextRequest){
    const body = await req.json();
    try {
        console.log("body: ", body);

        const sendMailResponse = await sendMail({
            email: process.env.SMTP_SERVER_USERNAME || 'crampusgaming@gmail.com',
            sendTo: "swaparupmukherjee144@gmail.com",
            subject: 'Someone messaged you from your website',
            text: "",
            html: `
                <!DOCTYPE html>
                <html lang="en" style="margin:0; padding:0;">
                    <head>
                        <meta charset="UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                        <title>New Contact Message</title>
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
                                    <h2 style="color:#222; font-size:24px; margin-bottom:10px;">New Contact Form Submission</h2>
                                    <p style="font-size:16px; color:#555;">A user has submitted a message through the contact form.</p>
                                    </td>
                                </tr>

                                <!-- User Details -->
                                <tr>
                                    <td style="padding: 30px 0;">
                                    <table width="100%" cellpadding="10" cellspacing="0" border="0" style="background-color:#fef2dc; border-radius: 10px; border: 1px solid #f2d89f;">
                                        <tr>
                                        <td style="font-weight: bold; color:#b8860b;">Name:</td>
                                        <td style="color:#444;">${body.name}</td>
                                        </tr>
                                        <tr>
                                        <td style="font-weight: bold; color:#b8860b;">Email:</td>
                                        <td style="color:#444;">${body.email}</td>
                                        </tr>
                                        <tr>
                                        <td style="font-weight: bold; color:#b8860b; vertical-align: top;">Message:</td>
                                        <td style="color:#444;">${body.message}</td>
                                        </tr>
                                    </table>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="text-align: center; font-size:12px; color:#aaa; padding-top: 30px;">
                                    This message was sent via the Bakale's Flute website contact form.
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

        return NextResponse.json({
            success: true
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}