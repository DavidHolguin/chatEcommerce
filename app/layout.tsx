import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Assisto Edu",
  description: "Tu Asistente Educativo Inteligente",
  icons: {
    icon: '/img/assistoIcon192.png', // Cambia por el nombre y extensión de tu archivo
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#9333ea" /> {/* Cambia el color por el que desees */}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
