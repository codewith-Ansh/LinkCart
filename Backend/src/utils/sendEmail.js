const nodemailer = require("nodemailer");

let transporter;

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: true,
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 15000,
        });
    }

    return transporter;
};

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        if (!to || !subject || (!text && !html)) {
            throw new Error("Email payload is incomplete");
        }

        const activeTransporter = getTransporter();
        const info = await activeTransporter.sendMail({
            from: `"LinkCart" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log(`Email sent to ${to}: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error("Error:", error.message);
        throw error;
    }
};

module.exports = sendEmail;
