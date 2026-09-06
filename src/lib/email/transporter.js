import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(
      process.env.SMTP_PORT || 465
    ),
    secure:
      process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD?.replace(/\s+/g, ""),
    },
  });

  return transporter;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  attachments = [],
}) {
  if (!to) {
    throw new Error(
      "Recipient email is required"
    );
  }

  const mailer = getTransporter();

  return mailer.sendMail({
    from:
      process.env.EMAIL_FROM ||
      process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
    attachments,
  });
}