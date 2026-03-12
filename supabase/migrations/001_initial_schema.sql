-- 급구커버 MVP 초기 스키마

-- users
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  role text not null check (role in ('owner', 'worker', 'owner_worker', 'admin')),
  name text not null,
  phone text,
  is_phone_verified boolean not null default false,
  profile_image_url text,
  status text not null default 'active' check (status in ('active', 'suspended', 'deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- owner_profiles
create table if not exists owner_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  business_type text,
  operating_years integer,
  intro text,
  region_text text,
  is_verified_owner boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

-- worker_profiles
create table if not exists worker_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  is_owner_worker boolean not null default false,
  years_of_experience integer not null default 0,
  experience_tags text[] not null default '{}',
  availability_tags text[] not null default '{}',
  preferred_regions text[] not null default '{}',
  radius_km integer not null default 3,
  can_start_immediately boolean not null default false,
  attendance_score numeric(5,2) not null default 100,
  no_show_count integer not null default 0,
  late_count integer not null default 0,
  cancellation_count integer not null default 0,
  rehire_count integer not null default 0,
  intro text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

-- stores
create table if not exists stores (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references users(id) on delete cascade,
  store_name text not null,
  category text not null default 'cafe',
  address text not null,
  detail_address text,
  lat numeric(10,7),
  lng numeric(10,7),
  phone text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- shift_requests
create table if not exists shift_requests (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  owner_user_id uuid not null references users(id) on delete cascade,
  shift_date date not null,
  start_time time not null,
  end_time time not null,
  hourly_wage integer not null,
  urgency_level text not null default 'high' check (urgency_level in ('normal', 'high', 'urgent')),
  experience_required boolean not null default true,
  allow_beginner boolean not null default false,
  task_tags text[] not null default '{}',
  memo text,
  worker_type_preference text not null default 'any' check (worker_type_preference in ('any', 'worker_only', 'owner_worker_preferred')),
  status text not null default 'open' check (status in ('open', 'matched', 'completed', 'cancelled')),
  deadline_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- shift_applications
create table if not exists shift_applications (
  id uuid primary key default gen_random_uuid(),
  shift_request_id uuid not null references shift_requests(id) on delete cascade,
  worker_user_id uuid not null references users(id) on delete cascade,
  status text not null default 'applied' check (status in ('applied', 'withdrawn', 'accepted', 'rejected', 'cancelled')),
  applied_at timestamptz not null default now(),
  unique(shift_request_id, worker_user_id)
);

-- shift_matches
create table if not exists shift_matches (
  id uuid primary key default gen_random_uuid(),
  shift_request_id uuid not null references shift_requests(id) on delete cascade,
  worker_user_id uuid not null references users(id) on delete cascade,
  application_id uuid references shift_applications(id) on delete set null,
  match_status text not null default 'confirmed' check (match_status in ('confirmed', 'checked_in', 'completed', 'cancelled', 'no_show')),
  confirmed_at timestamptz not null default now(),
  checked_in_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  no_show_reported_at timestamptz,
  unique(shift_request_id)
);

-- checkins
create table if not exists checkins (
  id uuid primary key default gen_random_uuid(),
  shift_match_id uuid not null references shift_matches(id) on delete cascade,
  worker_user_id uuid not null references users(id) on delete cascade,
  checked_in_at timestamptz not null default now(),
  lat numeric(10,7),
  lng numeric(10,7),
  note text
);

-- reviews
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  shift_match_id uuid not null references shift_matches(id) on delete cascade,
  reviewer_user_id uuid not null references users(id) on delete cascade,
  target_user_id uuid not null references users(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  review_type text not null check (review_type in ('owner_to_worker', 'worker_to_owner')),
  comment text,
  created_at timestamptz not null default now()
);

-- favorite_workers
create table if not exists favorite_workers (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references users(id) on delete cascade,
  worker_user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(owner_user_id, worker_user_id)
);

-- notifications
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  related_id uuid,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- reports
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  reporter_user_id uuid not null references users(id) on delete cascade,
  target_user_id uuid not null references users(id) on delete cascade,
  shift_match_id uuid references shift_matches(id) on delete set null,
  report_type text not null,
  detail text,
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'rejected')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

-- 인덱스
create index if not exists idx_shift_requests_status_date on shift_requests(status, shift_date);
create index if not exists idx_shift_requests_store_id on shift_requests(store_id);
create index if not exists idx_shift_applications_shift_request_id on shift_applications(shift_request_id);
create index if not exists idx_shift_matches_worker_user_id on shift_matches(worker_user_id);
create index if not exists idx_notifications_user_id_is_read on notifications(user_id, is_read);

-- auth_user_id로 users 레코드 생성 트리거 (Supabase Auth 연동 시 사용)
-- RLS는 별도 마이그레이션에서 설정 권장
