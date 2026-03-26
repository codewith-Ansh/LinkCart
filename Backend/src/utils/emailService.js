const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD
  }
});

const sendOTP = async (email, otp) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
  <body style="margin:0;padding:0;background-color:#f4f4f7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:40px 16px;">
      <tr>
        <td align="center">

          <!-- Card -->
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

            <!-- Header bar -->
            <tr>
              <td align="center" style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:32px 40px 28px;">
                <p style="margin:0;font-size:26px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">LinkCart</p>
                <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.80);font-weight:400;">Secure Email Verification</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:40px 40px 32px;">

                <p style="margin:0 0 6px;font-size:20px;font-weight:700;color:#1e1b4b;">Verify your email address</p>
                <p style="margin:0 0 28px;font-size:14px;color:#6b7280;line-height:1.6;">Use the one-time code below to complete your signup. Do not share this code with anyone.</p>

                <!-- OTP box -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding:0 0 28px;">
                      <div style="display:inline-block;background-color:#f0f0ff;border:2px dashed #a5b4fc;border-radius:12px;padding:20px 48px;">
                        <p style="margin:0;font-size:40px;font-weight:800;letter-spacing:12px;color:#4f46e5;font-family:'Courier New',Courier,monospace;">${otp}</p>
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- Expiry notice -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="background-color:#fef9ec;border-radius:10px;padding:14px 20px;">
                      <p style="margin:0;font-size:13px;color:#92400e;">
                        &#9203;&nbsp; This code expires in <strong>5 minutes</strong>. Request a new one if it expires.
                      </p>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #e5e7eb;margin:0;" /></td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:24px 40px 32px;">
                <p style="margin:0 0 6px;font-size:12px;color:#9ca3af;text-align:center;line-height:1.6;">
                  If you didn't request this, you can safely ignore this email.<br/>Your account will not be affected.
                </p>
                <p style="margin:16px 0 0;font-size:12px;color:#d1d5db;text-align:center;">&copy; ${new Date().getFullYear()} LinkCart Team. All rights reserved.</p>
              </td>
            </tr>

          </table>
          <!-- /Card -->

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;

  await transporter.sendMail({
    from: `"LinkCart" <${process.env.EMAIL}>`,
    to: email,
    subject: "Your LinkCart verification code",
    html,
  });
};

module.exports = sendOTP;