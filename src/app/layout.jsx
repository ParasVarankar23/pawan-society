import "./globals.css";

import { AuthProvider } from "@/components/auth/AuthProvider";

export const metadata = {
  title: "Pawan Society Management",
  description:
    "Pawan Society Sector 7, Khanda Colony, New Panvel",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}