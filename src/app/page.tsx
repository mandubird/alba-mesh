import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        {/* 히어로 */}
        <section className="border-b border-stone-200 bg-gradient-to-b from-teal-50/50 to-white">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
            <div className="grid gap-12 md:grid-cols-2 md:gap-16">
              <div>
                <h1 className="text-3xl font-bold leading-tight text-stone-900 md:text-4xl">
                  갑자기 빈 근무를,
                  <br />
                  검증된 경험자로 빠르게 메우세요
                </h1>
                <p className="mt-4 text-lg text-stone-600">
                  카페 알바가 갑자기 취소했을 때,
                  <br />
                  당일·익일 공백을 근처의 경험자로 빠르게 연결해주는
                  <br />
                  <strong className="text-stone-800">소상공인 긴급 대타 매칭 서비스</strong>
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/auth/signup?role=owner"
                    className="rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-primary-dark"
                  >
                    사장님으로 시작하기
                  </Link>
                  <Link
                    href="/auth/signup?role=worker"
                    className="rounded-lg border-2 border-primary px-6 py-3 font-medium text-primary hover:bg-teal-50"
                  >
                    대타로 참여하기
                  </Link>
                </div>
                <p className="mt-4 text-sm text-stone-500">
                  알바뿐 아니라, 빈 시간이 있는 사장님도 검증된 대타로 참여할 수 있습니다.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["전화번호 인증", "업종 경험 태그", "출근률 공개", "재호출 가능"].map(
                    (badge) => (
                      <span
                        key={badge}
                        className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800"
                      >
                        {badge}
                      </span>
                    )
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
                  <span className="inline-block rounded bg-urgent/10 px-2 py-0.5 text-xs font-medium text-urgent">
                    긴급
                  </span>
                  <p className="mt-2 font-medium">오늘 18:00 ~ 22:00</p>
                  <p className="text-sm text-stone-600">성수동 카페 / 마감 보조</p>
                  <p className="mt-1 text-primary font-semibold">시급 13,000원</p>
                  <p className="text-xs text-stone-500">경력자 우선 · 도보 12분</p>
                  <button className="mt-3 w-full rounded-lg bg-primary py-2 text-sm font-medium text-white">
                    즉시 지원 가능
                  </button>
                </div>
                <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
                  <p className="font-medium">김OO</p>
                  <p className="text-sm text-stone-600">카페 경력 2년 · 출근률 98%</p>
                  <p className="text-xs text-stone-500">최근 근무 12회 · 재호출 4회</p>
                  <p className="mt-1 text-xs text-green-600">지금 출발 가능</p>
                  <button className="mt-3 w-full rounded-lg border border-primary py-2 text-sm font-medium text-primary">
                    바로 요청하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 문제 공감 */}
        <section id="intro" className="border-b border-stone-200 bg-white py-16">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-2xl font-bold text-stone-900 md:text-3xl">
              알바 공백 하나가, 하루 장사를 망칩니다
            </h2>
            <ul className="mt-6 space-y-2 text-left text-stone-600">
              <li>• 내일 오픈인데 사람이 비었습니다.</li>
              <li>• 오늘 저녁 피크타임 4시간만 급합니다.</li>
              <li>• 당근에 올려도, 알바앱에 올려도 지금 올 사람은 잘 안 잡힙니다.</li>
              <li>• 결국 사장님이 직접 들어가고, 기존 직원이 버티고, 매장 컨디션이 무너집니다.</li>
            </ul>
            <p className="mt-6 text-stone-700">
              이 서비스는 느린 채용공고가 아니라,
              <br />
              <strong>오늘 비는 근무를 해결하는 운영 복구 도구</strong>입니다.
            </p>
          </div>
        </section>

        {/* 해결 방식 */}
        <section className="border-b border-stone-200 bg-stone-50 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-2xl font-bold text-stone-900 md:text-3xl">
              구인공고가 아니라, 운영 위기 복구 흐름으로 설계했습니다
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "급한 근무 등록",
                  desc: "날짜, 시간, 시급, 필요한 경험만 입력하면 1분 안에 공백을 등록할 수 있습니다.",
                },
                {
                  title: "근처 경험자에게 즉시 알림",
                  desc: "반경, 이동시간, 업종 경험 태그를 기준으로 지금 가능한 대타에게 바로 노출됩니다.",
                },
                {
                  title: "빠르게 확정하고 출근 체크인",
                  desc: "확정 후에는 출근 전 확인과 체크인까지 이어져 “지원만 하고 안 오는 문제”를 줄입니다.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="font-semibold text-stone-900">{card.title}</h3>
                  <p className="mt-2 text-sm text-stone-600">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 신뢰 장치 */}
        <section className="border-b border-stone-200 bg-white py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-2xl font-bold text-stone-900 md:text-3xl">
              중요한 건 지원자 수가 아니라, 진짜 오는 사람입니다
            </h2>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "전화번호 인증", desc: "최소한의 본인 확인이 끝난 사용자만 활동합니다." },
                {
                  title: "업종 경험 태그",
                  desc: "카페 경력, 마감 가능, 포스 가능 등 바로 투입 가능한 정보를 먼저 봅니다.",
                },
                { title: "출근률 공개", desc: "잘 오는 사람과 불안한 사람을 구분할 수 있어야 합니다." },
                {
                  title: "거리/도착 시간 표시",
                  desc: "긴급 근무는 실력만큼 거리와 이동시간이 중요합니다.",
                },
                { title: "체크인 기록", desc: "근무 시작 시점 체크인으로 실제 출근 여부를 남깁니다." },
                {
                  title: "재호출 가능",
                  desc: "한 번 잘 맞았던 사람은 다음에도 다시 부를 수 있습니다.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-stone-200 p-4"
                >
                  <h3 className="font-medium text-stone-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 재호출 */}
        <section className="border-b border-stone-200 bg-stone-50 py-16">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-2xl font-bold text-stone-900">
              한 번 잘 맞았던 사람은, 다음에도 다시 부를 수 있어야 합니다
            </h2>
            <p className="mt-4 text-stone-600">
              매번 처음부터 찾지 마세요. 만족한 대타를 저장하고, 다음 공백 때 바로 다시 요청하세요.
            </p>
            <ul className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-stone-700">
              <li>즐겨찾기 저장</li>
              <li>지난 근무 기록 확인</li>
              <li>재호출 버튼 제공</li>
              <li>재호출 많은 근무자 우선 신뢰</li>
            </ul>
          </div>
        </section>

        {/* 공급자 유입 */}
        <section className="border-b border-stone-200 bg-white py-16">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-2xl font-bold text-stone-900">
              추가 수입이 필요한 경험자라면, 빈 시간에 대타로 참여할 수 있습니다
            </h2>
            <p className="mt-4 text-stone-600">
              카페 경력자, 주말·야간 추가근무 희망자, 그리고 빈 시간이 있는 사장님도 검증된 대타로
              참여할 수 있습니다.
            </p>
            <p className="mt-2 text-sm text-stone-500">
              사장님도 때로는 사람을 구하는 입장이면서, 어떤 날에는 직접 일하러 갈 수 있는
              공급자입니다. 이 현실을 공급망으로 연결합니다.
            </p>
            <Link
              href="/auth/signup?role=worker"
              className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-primary-dark"
            >
              대타로 등록하기
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b border-stone-200 bg-stone-50 py-16">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="text-center text-2xl font-bold text-stone-900">자주 묻는 질문</h2>
            <dl className="mt-8 space-y-6">
              {[
                {
                  q: "일반 알바앱이랑 뭐가 다른가요?",
                  a: "이 서비스는 장기 채용보다 당일·익일 긴급 공백 해결에 집중합니다. 경험, 거리, 출근률, 체크인 같은 즉시 투입 신뢰 정보를 우선 보여줍니다.",
                },
                {
                  q: "진짜 오는 사람인지 어떻게 믿나요?",
                  a: "전화번호 인증, 출근률, 취소/노쇼 기록, 체크인 기록을 기반으로 신뢰도를 제공합니다.",
                },
                {
                  q: "초보도 지원할 수 있나요?",
                  a: "공고마다 다릅니다. 사장님이 경험자만, 초보 가능 여부를 직접 설정합니다.",
                },
                {
                  q: "사장님도 대타로 참여할 수 있나요?",
                  a: "가능합니다. 다만 메인 기능은 긴급 공백 해결이고, 사장님 대타는 공급 보완 장치로 운영합니다.",
                },
              ].map((faq) => (
                <div key={faq.q} className="rounded-lg border border-stone-200 bg-white p-4">
                  <dt className="font-medium text-stone-900">{faq.q}</dt>
                  <dd className="mt-2 text-sm text-stone-600">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 최종 CTA */}
        <section className="bg-primary py-16 text-white">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">
              오늘 비는 근무, 오늘 해결하세요
            </h2>
            <p className="mt-4 opacity-90">
              내일 오픈이 비었거나, 오늘 저녁 피크타임이 급하다면 지금 바로 공백을 등록하고 근처
              경험자를 확인해보세요.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/dashboard/owner/shifts/new"
                className="rounded-lg bg-white px-6 py-3 font-medium text-primary hover:bg-stone-100"
              >
                지금 공백 등록하기
              </Link>
              <Link
                href="/auth/signup?role=worker"
                className="rounded-lg border-2 border-white px-6 py-3 font-medium hover:bg-white/10"
              >
                대타로 참여하기
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
