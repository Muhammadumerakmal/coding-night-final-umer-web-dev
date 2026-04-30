import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HelpHub AI — Community Support Platform",
  description:
    "An AI-powered community platform where people connect to give and receive help, track contributions, and grow together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col text-[#18181b] antialiased">
        <div className="ambient-gradient-bg" />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
