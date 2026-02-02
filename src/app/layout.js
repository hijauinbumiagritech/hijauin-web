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

export const metadata = {
  title: "CV. Hijauin Bumi Agritech",
  description: "Solusi Rehabilitasi Hutan, Survei Drone, dan Pengadaan Bibit Unggul",
  icons: {
    icon: [
      { url: "/logo-hijauin.jpeg" },
      { url: "/logo-hijauin.jpeg", sizes: "50x150", type: "image/jpeg" },
    ],
    shortcut: "/logo-hijauin.jpeg",
    apple: "/logo-hijauin.jpeg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}