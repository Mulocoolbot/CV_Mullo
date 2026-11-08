import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PreferencesProvider } from "@/hooks/usePreferences";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ahmad Mulia Saputra (@Mulocoolbot) | Portfolio & CV",
  description: "Web Developer, Mobile Apps Developer, Full Stack Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      data-theme="dark"
      data-accent="emerald"
      className="dark"
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PreferencesProvider>{children}</PreferencesProvider>
      </body>
    </html>
  );
}
