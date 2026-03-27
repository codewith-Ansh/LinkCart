const sendEmail = require("./sendEmail");

const sendOTPEmail = async (email, otp) =>
    sendEmail({
        to: email,
        subject: "Your LinkCart verification code",
        text: `Your LinkCart OTP is ${otp}. It expires in 5 minutes.`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
                <h2>Verify your email address</h2>
                <p>Use the OTP below to continue. Do not share this code with anyone.</p>
                <p style="font-size: 28px; font-weight: 700; letter-spacing: 6px;">${otp}</p>
                <p>This OTP expires in 5 minutes.</p>
            </div>
        `,
    });

module.exports = sendOTPEmail;
