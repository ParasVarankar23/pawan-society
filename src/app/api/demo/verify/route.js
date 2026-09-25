import {
    apiHandler,
    authenticated,
    error,
    json,
} from "@/app/api/_utils";

import { verifySmtpConnection } from "@/lib/email/transporter";

export async function POST() {
    return apiHandler(() =>
        authenticated(async () => {
            try {
                const result = await verifySmtpConnection();
                return json(result);
            } catch (verificationError) {
                console.error("SMTP verification failed:", {
                    code: verificationError?.code,
                    command: verificationError?.command,
                    responseCode: verificationError?.responseCode,
                    message: verificationError?.message,
                });

                return error(
                    "SMTP connection could not be verified. Check SMTP configuration and connectivity.",
                    502
                );
            }
        })
    );
}
