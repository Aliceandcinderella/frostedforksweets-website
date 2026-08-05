/**
 * Frosted Fork — Email layer
 *
 * Current production delivery uses the local system sendmail binary when available.
 * Public website email remains frostedforksweets@outlook.com.
 *
 * Cloudflare Email Routing for orders@frostedforksweets.com is documented as a
 * lower-priority future inbound alias, not a runtime dependency.
 */

import { spawn } from "node:child_process";

export type EmailPayload = {
  to: string;
  subject: string;
  body: string;
};

const SENDMAIL_PATH = process.env.SENDMAIL_PATH || "/usr/sbin/sendmail";
const FROM_ADDRESS = process.env.ORDER_NOTIFICATION_FROM || "no-reply@frostedforksweets.com";
const DELIVERY_MODE = process.env.EMAIL_DELIVERY_MODE || "sendmail";

function sanitizeHeader(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function buildMessage(payload: EmailPayload): string {
  const to = sanitizeHeader(process.env.ORDER_NOTIFICATION_TO || payload.to);
  const subject = sanitizeHeader(payload.subject);
  const from = sanitizeHeader(FROM_ADDRESS);

  return [
    `To: ${to}`,
    `From: Frosted Fork Sweets <${from}>`,
    `Reply-To: ${from}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    payload.body,
    "",
  ].join("\n");
}

async function sendViaSendmail(payload: EmailPayload): Promise<boolean> {
  return new Promise((resolve) => {
    const child = spawn(SENDMAIL_PATH, ["-t", "-oi"], {
      stdio: ["pipe", "ignore", "pipe"],
    });

    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (err) => {
      console.error("Frosted Fork sendmail launch failed", err.message);
      resolve(false);
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log("Frosted Fork notification sent", {
          to: process.env.ORDER_NOTIFICATION_TO || payload.to,
          subject: sanitizeHeader(payload.subject),
          mode: "sendmail",
        });
        resolve(true);
      } else {
        console.error("Frosted Fork sendmail delivery failed", {
          code,
          stderr: stderr.slice(0, 500),
        });
        resolve(false);
      }
    });

    child.stdin.end(buildMessage(payload));
  });
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  if (process.env.NODE_ENV === "production") {
    if (DELIVERY_MODE === "sendmail") {
      return sendViaSendmail(payload);
    }

    console.log("Frosted Fork notification captured", {
      to: process.env.ORDER_NOTIFICATION_TO || payload.to,
      subject: sanitizeHeader(payload.subject),
      bodyLength: payload.body.length,
      mode: DELIVERY_MODE,
    });
    return true;
  }

  console.log("── 📧 Email dev stub ──");
  console.log(`To: ${payload.to}`);
  console.log(`Subject: ${payload.subject}`);
  console.log(`Body: ${payload.body}`);
  console.log("──────────────────────");
  return true;
}
