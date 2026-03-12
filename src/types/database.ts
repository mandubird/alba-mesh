export type UserRole = "owner" | "worker" | "owner_worker" | "admin";
export type UserStatus = "active" | "suspended" | "deleted";
export type UrgencyLevel = "normal" | "high" | "urgent";
export type ShiftRequestStatus = "open" | "matched" | "completed" | "cancelled";
export type ApplicationStatus = "applied" | "withdrawn" | "accepted" | "rejected" | "cancelled";
export type MatchStatus = "confirmed" | "checked_in" | "completed" | "cancelled" | "no_show";
export type WorkerTypePreference = "any" | "worker_only" | "owner_worker_preferred";
export type ReviewType = "owner_to_worker" | "worker_to_owner";

export interface User {
  id: string;
  auth_user_id: string | null;
  role: UserRole;
  name: string;
  phone: string | null;
  is_phone_verified: boolean;
  profile_image_url: string | null;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface OwnerProfile {
  id: string;
  user_id: string;
  business_type: string | null;
  operating_years: number | null;
  intro: string | null;
  region_text: string | null;
  is_verified_owner: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkerProfile {
  id: string;
  user_id: string;
  is_owner_worker: boolean;
  years_of_experience: number;
  experience_tags: string[];
  availability_tags: string[];
  preferred_regions: string[];
  radius_km: number;
  can_start_immediately: boolean;
  attendance_score: number;
  no_show_count: number;
  late_count: number;
  cancellation_count: number;
  rehire_count: number;
  intro: string | null;
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: string;
  owner_user_id: string;
  store_name: string;
  category: string;
  address: string;
  detail_address: string | null;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ShiftRequest {
  id: string;
  store_id: string;
  owner_user_id: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  hourly_wage: number;
  urgency_level: UrgencyLevel;
  experience_required: boolean;
  allow_beginner: boolean;
  task_tags: string[];
  memo: string | null;
  worker_type_preference: WorkerTypePreference;
  status: ShiftRequestStatus;
  deadline_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ShiftApplication {
  id: string;
  shift_request_id: string;
  worker_user_id: string;
  status: ApplicationStatus;
  applied_at: string;
}

export interface ShiftMatch {
  id: string;
  shift_request_id: string;
  worker_user_id: string;
  application_id: string | null;
  match_status: MatchStatus;
  confirmed_at: string;
  checked_in_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  no_show_reported_at: string | null;
}

export interface Checkin {
  id: string;
  shift_match_id: string;
  worker_user_id: string;
  checked_in_at: string;
  lat: number | null;
  lng: number | null;
  note: string | null;
}

export interface Review {
  id: string;
  shift_match_id: string;
  reviewer_user_id: string;
  target_user_id: string;
  rating: number;
  review_type: ReviewType;
  comment: string | null;
  created_at: string;
}

export interface FavoriteWorker {
  id: string;
  owner_user_id: string;
  worker_user_id: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  related_id: string | null;
  is_read: boolean;
  created_at: string;
}

export const TASK_TAGS = ["오픈", "마감", "포스", "음료", "청소", "홀응대"] as const;
export const EXPERIENCE_TAGS = ["카페경력", "포스가능", "오픈가능", "마감가능", "홀응대", "음료제조", "주말가능", "야간가능"] as const;
