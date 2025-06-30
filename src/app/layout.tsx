import { ThemeProvider } from "@/lib/Theme/theme-context";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VisionChat AI - AI Chatbot & Computer Vision",
  description: "Advanced AI chatbot with computer vision capabilities",
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
