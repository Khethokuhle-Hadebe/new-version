import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import "./globals.css";
import AppLayout from "@/components/layout/AppLayout";

const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "New Version",
    template: "%s | New Version",
  },
  description:
    "Your intentions. Your habits. Your next chapter. A personal space for goals, affirmations, journaling and daily growth.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${inter.variable} min-h-screen antialiased`}
      >
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
