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

type MailOptions = {
  subject: string;
  html: string;
  to?: string[];
  attachments?: {
    filename: string;
    content: Buffer;
    contentType?: string;
  }[];
};

export async function sendMail({
  subject,
  html,
  to,
  attachments = [],
}: MailOptions) {
  const recipients =
    to && to.length > 0
      ? to
      : process.env.SMTP_DEFAULT_MAIL_TO?.split(",") || [];

  if (recipients.length === 0) {
    throw new Error("No recipients defined");
  }

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: recipients.join(", "),
    subject,
    html,
    attachments,
  });
}
