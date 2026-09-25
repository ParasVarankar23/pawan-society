import {
    apiHandler,
    authenticated,
    error,
    getJsonBody,
    json,
} from "@/app/api/_utils";

import { sendEmail } from "@/lib/email/transporter";

export async function POST(request) {
    return apiHandler(() =>
        authenticated(async () => {
            const { recipient } = await getJsonBody(request);

            if (!recipient) {
                return error(
                    "Recipient email is required",
                    400
                );
            }

            try {
                const result = await sendEmail({
                    to: recipient,
                    subject: "HI",
                    text: "HI",
                    html: "<p>HI</p>",
                });

                return json({
                    sent: true,
                    messageId: result.messageId,
                });
            } catch (sendError) {
                console.error("Demo email failed:", {
                    code: sendError?.code,
                    command: sendError?.command,
                    responseCode: sendError?.responseCode,
                    message: sendError?.message,
                });

                return error(
                    "Email could not be sent. Check SMTP configuration and connectivity.",
                    502
                );
            }
        })
    );
}
