import { NextResponse } from 'next/server';

import sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: Request) {
    try {
        const { email, firstName } = await request.json();

        // Send email with proper authentication
        await sgMail.send({
            to: email,
            from: {
                email: 'prakul@zephyrtechnology.net',
                name: 'Prakul at Zephyr Technology' // Adding a name helps with deliverability
            },
            subject: 'Welcome to Zephyr!',
            text: `Hi ${firstName}, thank you for signing up for Zephyr!`,
            html: `
                <h1>Welcome to Zephyr!</h1>
                <p>Hi Coach ${firstName},</p>
                <p>Thank you for signing up for Zephyr! We're working with Coaches Jimmy Krueger, Fred Kaiser, and many more to get this up and running for Texas high schools.</p>
                <p>I'd love to connect and learn more about your program's requirements. Please feel free to grab a time here: <br>https://calendly.com/prakul/tasco-coaches-chat</p>
                <p>Best regards,<br>Prakul</p>
            `,
            trackingSettings: {
                clickTracking: {
                    enable: true
                },
                openTracking: {
                    enable: true
                }
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Email notification error:', error);
        return NextResponse.json(
            { error: 'Failed to send email notification' },
            { status: 500 }
        );
    }
}