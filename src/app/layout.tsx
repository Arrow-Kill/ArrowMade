import { ThemeProvider } from "@/lib/Theme/theme-context";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeuroCap",
  description: "NeuroCap an AI-powered Crypto Analytics Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
