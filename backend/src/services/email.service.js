import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async (email, code) => {
  await transporter.sendMail({
    from: `"AGEEMAKE" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "AGEEMAKE Email Verification",

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
        <h2>Welcome to AGEEMAKE!</h2>

        <p>Thank you for creating your account.</p>

        <p>Your verification code is:</p>

        <div style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          text-align: center;
          padding: 20px;
        ">
          ${code}
        </div>

        <p>This code will expire in 10 minutes.</p>

        <p>
          If you didn't create an AGEEMAKE account, you can ignore this email.
        </p>
      </div>
    `,
  });
};