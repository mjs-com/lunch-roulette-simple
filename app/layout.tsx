import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ランチルーレット - 今日の食事を決めましょう",
  description: "外食先が決まらない時に、シンプルに今日の食事を決められるアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}

