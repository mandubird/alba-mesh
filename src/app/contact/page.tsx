import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "example@email.com";
const KAKAO_CHANNEL = process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL;

export const metadata: Metadata = {
  title: "문의하기 | 급구커버",
  description: "급구커버 서비스 문의",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-2xl font-bold text-stone-900">문의하기</h1>
        <p className="mt-4 text-stone-700">
          서비스 관련 문의는 아래 채널을 통해 가능합니다.
        </p>
        <ul className="mt-8 space-y-4 text-stone-700">
          <li>
            <span className="font-medium text-stone-900">카카오톡 채널 (추천)</span>
            {KAKAO_CHANNEL ? (
              <>
                {": "}
                <a
                  href={KAKAO_CHANNEL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-primary-dark"
                >
                  채널로 이동
                </a>
              </>
            ) : (
              <span className="text-stone-500"> (운영 중 연결 예정)</span>
            )}
          </li>
          <li>
            <span className="font-medium text-stone-900">이메일</span>
            {": "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-primary underline hover:text-primary-dark"
            >
              {CONTACT_EMAIL}
            </a>
          </li>
        </ul>
      </main>
      <Footer />
    </>
  );
}
