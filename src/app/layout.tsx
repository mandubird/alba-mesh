import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "급구커버 | 갑자기 빈 근무를, 검증된 경험자로",
  description:
    "카페 알바가 갑자기 취소했을 때, 당일·익일 공백을 근처의 경험자로 빠르게 연결해주는 소상공인 긴급 대타 매칭 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
