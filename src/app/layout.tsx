import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/zai.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Z.AI Slides - AI-Powered Presentation Generator",
  description: "Transform your ideas into stunning presentations with AI. Built by Z.AI, the leading AI platform.",
  keywords: ["Z.AI", "AI Slides", "Presentations", "Artificial Intelligence", "Presentation Generator", "AI Tools"],
  authors: [{ name: "Z.AI Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Z.AI Slides - AI-Powered Presentation Generator",
    description: "Transform your ideas into stunning presentations with AI",
    url: "https://z.ai/slides",
    siteName: "Z.AI Slides",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Z.AI Slides - AI-Powered Presentation Generator",
    description: "Transform your ideas into stunning presentations with AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
