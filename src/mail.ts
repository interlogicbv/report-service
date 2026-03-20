import * as nodemailer from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail(subject: string, content: string) {
  const recipients = process.env.FORWARDING_MAIL_TO?.split(",") || [];
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: recipients.join(", "),
    subject: subject,
    html: content,
  });
}
