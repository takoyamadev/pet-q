import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PetQ（ペットキュー）- ペット飼育者のための匿名掲示板",
  description: "ペット飼育者同士が気軽に情報交換できる匿名掲示板。犬・猫・小動物・鳥・爬虫類など、あらゆるペットの飼育相談・健康・しつけ・雑談ができるコミュニティサイトです。",
  keywords: "ペット,掲示板,犬,猫,小動物,鳥,爬虫類,飼育相談,ペット健康,しつけ",
  openGraph: {
    title: "PetQ（ペットキュー）",
    description: "ペット飼育者のための匿名掲示板",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
