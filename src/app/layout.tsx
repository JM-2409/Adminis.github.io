import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Adminis - Portal de Administración Residencial",
  description: "Plataforma de gestión para conjuntos residenciales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" style={{ colorScheme: "dark" }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#090d16] text-slate-100`}
      >
        {children}
      </body>
    </html>
  );
}
