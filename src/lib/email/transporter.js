import nodemailer from "nodemailer";

let transporter = null;

function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD;

  if (!host || !user || !password) {
    throw new Error(
      "SMTP_HOST, SMTP_USER, and SMTP_PASSWORD must be configured"
    );
  }

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("SMTP_PORT must be a valid port number");
  }

  const configuredSecure = process.env.SMTP_SECURE?.trim().toLowerCase();
  const secure =
    configuredSecure === undefined || configuredSecure === ""
      ? port === 465
      : configuredSecure === "true";

  return {
    host,
    port,
    secure,
    user,
    password: password.replace(/\s+/g, ""),
  };
}

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const config = getSmtpConfig();

  transporter = nodemailer.createTransport({
    host: config.host,

    // Prefer IPv4
    family: 4,

    port: config.port,
    secure: config.secure,

    auth: {
      user: config.user,
      pass: config.password,
    },

    /*
     * TLS configuration
     *
     * Keep certificate verification enabled.
     * Do NOT disable this for Gmail.
     */
    tls: {
      rejectUnauthorized:
        process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== "false",

      minVersion: "TLSv1.2",
    },

    connectionTimeout: Number(
      process.env.SMTP_CONNECTION_TIMEOUT || 15000
    ),

    greetingTimeout: Number(
      process.env.SMTP_GREETING_TIMEOUT || 15000
    ),

    socketTimeout: Number(
      process.env.SMTP_SOCKET_TIMEOUT || 20000
    ),
  });

  return transporter;
}

export async function verifySmtpConnection() {
  const mailer = getTransporter();

  try {
    await mailer.verify();

    console.log("✅ SMTP connection verified successfully");

    return {
      verified: true,
    };
  } catch (error) {
    console.error("❌ SMTP verification failed:", {
      code: error?.code,
      command: error?.command,
      responseCode: error?.responseCode,
      message: error?.message,
    });

    throw error;
  }
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  attachments = [],
}) {
  const recipient = String(to || "").trim();

  if (!recipient) {
    throw new Error("Recipient email is required");
  }

  // Basic email validation
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(recipient)) {
    throw new Error("Recipient email is invalid");
  }

  const mailer = getTransporter();

  try {
    const result = await mailer.sendMail({
      from:
        process.env.SMTP_FROM ||
        process.env.SMTP_USER,

      to: recipient,

      subject: String(subject || ""),

      text: text || undefined,

      html: html || undefined,

      attachments,
    });

    console.log("✅ Email sent successfully:", {
      messageId: result.messageId,
      to: recipient,
    });

    return result;
  } catch (error) {
    console.error("❌ SMTP send failed:", {
      code: error?.code,
      command: error?.command,
      responseCode: error?.responseCode,
      message: error?.message,
    });

    throw error;
  }
}