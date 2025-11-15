import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
  title: "AI Slides - Intelligent Presentation Generator",
  description: "Create stunning presentations with AI-powered content generation. Built with Next.js, TypeScript, and modern web technologies.",
  keywords: ["AI Slides", "Presentations", "AI", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "presentation generator"],
  authors: [{ name: "AI Slides Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "AI Slides - Intelligent Presentation Generator",
    description: "Create stunning presentations with AI-powered content generation",
    url: "https://chat.z.ai",
    siteName: "AI Slides",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Slides - Intelligent Presentation Generator",
    description: "Create stunning presentations with AI-powered content generation",
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
