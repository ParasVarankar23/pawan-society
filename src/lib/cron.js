export function isValidCronRequest(request) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return false;
  }

  const authorization =
    request.headers.get("authorization");

  const cronHeader =
    request.headers.get("x-cron-secret");

  return (
    authorization === `Bearer ${secret}` ||
    cronHeader === secret
  );
}

export function requireCron(request) {
  if (!isValidCronRequest(request)) {
    throw new Error("INVALID_CRON_SECRET");
  }
}