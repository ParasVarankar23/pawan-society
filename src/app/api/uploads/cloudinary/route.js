import crypto from "node:crypto";

import {
    apiHandler,
    authenticated,
    error,
    json,
} from "@/app/api/_utils";

export async function POST(request) {
    return apiHandler(() =>
        authenticated(async () => {
            const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
            const apiKey = process.env.CLOUDINARY_API_KEY;
            const apiSecret = process.env.CLOUDINARY_API_SECRET;

            if (!cloudName || !apiKey || !apiSecret) {
                return error("Cloudinary is not configured.", 500);
            }

            const formData = await request.formData();
            const file = formData.get("file");

            if (!file || typeof file.arrayBuffer !== "function") {
                return error("An image file is required.", 400);
            }

            if (!file.type?.startsWith("image/")) {
                return error("Only image files can be uploaded.", 400);
            }

            const timestamp = Math.floor(Date.now() / 1000);
            const folder = "pawan-society/electricity";
            const signature = crypto
                .createHash("sha1")
                .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
                .digest("hex");

            const uploadData = new FormData();
            uploadData.append("file", file);
            uploadData.append("api_key", apiKey);
            uploadData.append("timestamp", String(timestamp));
            uploadData.append("folder", folder);
            uploadData.append("signature", signature);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: "POST",
                    body: uploadData,
                }
            );
            const result = await response.json();

            if (!response.ok || !result.secure_url) {
                return error(
                    result.error?.message || "Cloudinary upload failed.",
                    response.status >= 400 && response.status < 500 ? response.status : 502
                );
            }

            return json({
                secureUrl: result.secure_url,
                publicId: result.public_id,
            });
        })
    );
}
