import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "World Cup 2026 Analytics",
  description: "Live scores, standings and stats for the FIFA World Cup 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="wave-container">
          <div className="wave" />
          <div className="wave wave-2" />
        </div>
        {children}
      </body>
    </html>
  );
}
