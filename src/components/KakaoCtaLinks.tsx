import { getKakaoOpenChatUrls } from "@/lib/pretotype";

type Variant = "hero" | "footerCta";

const baseHeroOwner =
  "rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-primary-dark";
const baseHeroWorker =
  "rounded-lg border-2 border-primary px-6 py-3 font-medium text-primary hover:bg-teal-50";
const baseBannerOwner =
  "rounded-lg bg-white px-6 py-3 font-medium text-primary hover:bg-stone-100";
const baseBannerWorker =
  "rounded-lg border-2 border-white px-6 py-3 font-medium hover:bg-white/10";

export function KakaoCtaLinks({ variant }: { variant: Variant }) {
  const { owner, worker } = getKakaoOpenChatUrls();
  const isHero = variant === "hero";

  return (
    <div
      className={`flex flex-wrap ${isHero ? "gap-3" : "justify-center gap-4"}`}
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
