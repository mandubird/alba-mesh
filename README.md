# 급구커버 (Geupgu Cover)

**갑자기 빈 근무를, 검증된 경험자로 빠르게 메워주는** 소상공인 긴급 대타 매칭 서비스 MVP입니다.

- **한 줄 정의:** 카페 알바가 갑자기 취소했을 때, 당일·익일 공백을 근처의 경험자로 빠르게 연결
- **MVP 범위:** 카페 1개 업종, 1개 지역, 당일/익일 긴급 공백

## 기술 스택

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend/DB/Auth:** Supabase

## 로컬 실행 방법

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **환경 변수 설정**
   - 프로젝트에 빌드용 placeholder가 들어 있는 `.env.local`이 있을 수 있습니다.
   - **실제 로그인/DB 사용**을 위해 [Supabase](https://supabase.com) 프로젝트를 만들고, `.env.local`을 아래처럼 수정하세요.
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
   - 없으면 `.env.example`을 복사해 `.env.local`을 만든 뒤 위 값으로 채우세요.

3. **DB 마이그레이션**
   - Supabase 대시보드 → SQL Editor에서 `supabase/migrations/001_initial_schema.sql` 내용 실행

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   - 브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 주요 화면

| 경로 | 설명 |
|------|------|
| `/` | 랜딩페이지 (히어로, 문제공감, 해결방식, 신뢰, FAQ, CTA) |
| `/auth/login` | 로그인 |
| `/auth/signup?role=owner` | 사장님 회원가입 |
| `/auth/signup?role=worker` | 대타 회원가입 |
| `/dashboard/owner` | 사장님 대시보드 (공백 목록, 재호출) |
| `/dashboard/owner/stores/new` | 매장 등록 |
| `/dashboard/owner/shifts/new` | 긴급 공백 등록 |
| `/dashboard/owner/shifts/[id]/applicants` | 지원자 목록 및 확정 |
| `/dashboard/owner/favorites` | 재호출(즐겨찾기) 목록 |
| `/dashboard/worker` | 근무자 긴급 공고 피드 |
| `/dashboard/worker/profile` | 근무자 프로필 |
| `/dashboard/worker/profile/edit` | 프로필 수정(경력, 태그, 반경 등) |
| `/dashboard/worker/matches` | 내 매칭 목록 |
| `/dashboard/worker/matches/[id]` | 매칭 상세 및 출근 체크인 |
| `/admin` | 관리자 대시보드 (admin 역할만) |

## 핵심 흐름

1. **사장님:** 회원가입 → 매장 등록 → 긴급 공백 등록 → 지원자 확인 → 1명 확정
2. **근무자:** 회원가입 → 프로필 등록(경력, 태그) → 공고 탐색 및 지원 → 확정 시 매칭 상세에서 출근 체크인
3. **재호출:** 사장님이 만족한 근무자를 즐겨찾기 후 다시 요청

## DB 스키마

- `users` - 공통 사용자 (role: owner / worker / owner_worker / admin)
- `owner_profiles`, `worker_profiles` - 역할별 프로필
- `stores` - 매장
- `shift_requests` - 긴급 공백
- `shift_applications` - 지원 내역
- `shift_matches` - 확정 매칭
- `checkins` - 출근 체크인
- `reviews` - 상호 평가
- `favorite_workers` - 재호출용 즐겨찾기
- `notifications`, `reports`

마이그레이션 파일: `supabase/migrations/001_initial_schema.sql`

## 구현 우선순위 (체크리스트)

- [x] Phase 1: Next.js, Tailwind, Supabase 연동, Auth, DB migration
- [x] Phase 2: 랜딩페이지
- [x] Phase 3: 사장님(매장, 공백, 지원자 확정)
- [x] Phase 4: 근무자(프로필, 공고 피드, 지원, 체크인)
- [x] Phase 5: 재호출(즐겨찾기)
- [x] Phase 6: 최소 관리자 페이지
- [ ] 리뷰(평가) UI
- [ ] RLS 정책 상세 설정
- [ ] 알림(앱 내 알림)

## 참고

- 개발 명세: `26.03.09_긴급알바구하기_확장_개발문서_v2.md`
- MVP는 카페 1개 업종만 노출하며, “채용”이 아닌 “오늘 비는 근무 해결” 메시지를 강조합니다.
