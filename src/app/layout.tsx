import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "급구커버 | 갑자기 알바 펑크났나요?",
  description:
    "미사역 인근 베타 테스트 중. 갑작스런 근무 공백을 사장님과 근무자를 빠르게 연결하는 긴급 대타 매칭 실험 서비스입니다.",
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
