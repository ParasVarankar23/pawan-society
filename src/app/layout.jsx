import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Pawan Society",
    template: "%s | Pawan Society",
  },

  description:
    "Pawan Society Management System for society billing, members, maintenance, payments, expenses, notices and reports.",

  keywords: [
    "Pawan Society",
    "Society Management",
    "Society Billing",
    "Maintenance Billing",
    "Society Management System",
    "Apartment Society",
  ],

  authors: [
    {
      name: "Pawan Society",
    },
  ],

  applicationName: "Pawan Society",

  robots: {
    index: false,
    follow: false,
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <div className="flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}