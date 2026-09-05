import {
  apiHandler,
  authenticated,
  json,
} from "@/app/api/_utils";

export async function GET() {
  return apiHandler(() =>
    authenticated(async (user) => {
      return json({
        user,
      });
    })
  );
}