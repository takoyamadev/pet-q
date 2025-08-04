import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WebSiteJsonLd } from "@/components/seo/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://pet-q.tkym-dev.workers.dev",
  ),
  title: {
    default: "PetQ（ペットキュー）- ペット飼育者のための匿名掲示板",
    template: "%s | PetQ（ペットキュー）",
  },
  description:
    "ペット飼育者同士が気軽に情報交換できる匿名掲示板。犬・猫・小動物・鳥・爬虫類など、あらゆるペットの飼育相談・健康・しつけ・雑談ができるコミュニティサイトです。",
  keywords: [
    "ペット",
    "掲示板",
    "犬",
    "猫",
    "小動物",
    "鳥",
    "爬虫類",
    "飼育相談",
    "ペット健康",
    "しつけ",
    "匿名相談",
    "ペットコミュニティ",
  ],
  authors: [{ name: "PetQ Team" }],
  creator: "PetQ",
  publisher: "PetQ",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "PetQ（ペットキュー）- ペット飼育者のための匿名掲示板",
    description:
      "ペット飼育者同士が気軽に情報交換できる匿名掲示板。飼育相談・健康・しつけなど、ペットに関する悩みを共有しましょう。",
    url:
      process.env.NEXT_PUBLIC_BASE_URL || "https://pet-q.tkym-dev.workers.dev",
    siteName: "PetQ",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "PetQ - ペット飼育者のための匿名相談コミュニティ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PetQ（ペットキュー）- ペット飼育者のための匿名掲示板",
    description: "ペット飼育者同士が気軽に情報交換できる匿名掲示板。",
    creator: "@petq",
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical:
      process.env.NEXT_PUBLIC_BASE_URL || "https://pet-q.tkym-dev.workers.dev",
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
        <WebSiteJsonLd />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
