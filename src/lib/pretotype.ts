/** Pretotype MVP: 카카오 오픈채팅 URL (미설정 시 `#` — 배포 시 env 설정) */
export function getKakaoOpenChatUrls() {
  return {
    owner: process.env.NEXT_PUBLIC_KAKAO_OPEN_CHAT_OWNER ?? "#",
    worker: process.env.NEXT_PUBLIC_KAKAO_OPEN_CHAT_WORKER ?? "#",
  };
}
