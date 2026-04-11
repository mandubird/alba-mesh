import { getKakaoOpenChatUrls } from "@/lib/pretotype";

type Variant = "hero" | "footerCta";

const touch =
  "inline-flex min-h-[48px] touch-manipulation items-center justify-center px-5 py-3.5 text-center text-[15px] font-medium leading-snug transition-[transform,opacity] active:opacity-90 sm:min-h-0 sm:px-6 sm:py-3 sm:text-base";

const baseHeroOwner = `w-full rounded-xl bg-primary text-white hover:bg-primary-dark sm:w-auto ${touch}`;
const baseHeroWorker = `w-full rounded-xl border-2 border-primary text-primary hover:bg-teal-50 sm:w-auto ${touch}`;
const baseBannerOwner = `w-full rounded-xl bg-white text-primary hover:bg-stone-100 sm:w-auto ${touch}`;
const baseBannerWorker = `w-full rounded-xl border-2 border-white text-white hover:bg-white/10 sm:w-auto ${touch}`;

export function KakaoCtaLinks({ variant }: { variant: Variant }) {
  const { owner, worker } = getKakaoOpenChatUrls();
  const isHero = variant === "hero";

  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap ${isHero ? "" : "items-stretch sm:justify-center sm:gap-4"}`}
    >
      <a
        href={owner}
        target="_blank"
        rel="noopener noreferrer"
        className={isHero ? baseHeroOwner : baseBannerOwner}
      >
        ⚡ 지금 대타 요청하기 (카톡)
      </a>
      <a
        href={worker}
        target="_blank"
        rel="noopener noreferrer"
        className={isHero ? baseHeroWorker : baseBannerWorker}
      >
        ⚡ 지금 출발 가능한 알바 참여 (카톡)
      </a>
    </div>
  );
}
