/**
 * types/index.ts - Global type definitions untuk Kinclong
 *
 * Semua domain types terpusat di sini untuk konsistensi
 * antara frontend, backend (Supabase), dan stores.
 *
 * Naming convention:
 * - Interface: PascalCase → User, QueueItem, Service
 * - Union types: camelCase → UserRole, VehicleType, QueueStatus
 */

// ─── User & Auth ──────────────────────────────────────────────────────────────

export type UserRole = 'owner' | 'operator' | 'kiosk_user';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  carwash_id: string;
  // Backend context (populated after login)
  tenant_id?: string;
  outlet_id?: string;
  avatar_url?: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Backend API Entities ─────────────────────────────────────────────────────

/** Tenant = business account (dari backend /api/auth/login response) */
export interface Tenant {
  id:                  string;
  name:                string;
  slug?:               string;
  subscriptionPlan:    'free' | 'starter' | 'pro' | 'enterprise';
  subscriptionStatus:  'active' | 'trialing' | 'past_due' | 'cancelled' | 'suspended';
  trialEndsAt?:        string;
  trialDaysRemaining?: number;
  maxVehicles?:        number | null;
  maxUsers?:           number | null;
  maxOutlets?:         number | null;
  settings?: {
    dashboardRetentionDays?: number;
    enableWhatsapp?:         boolean;
    enableLoyalty?:          boolean;
    enableExport?:           boolean;
  };
}

/** Outlet = physical location */
export interface Outlet {
  id:       string;
  name:     string;
  address?: string;
  city?:    string;
  phone?:   string;
  isActive: boolean;
}

/** Profile = user profile from backend */
export interface ApiProfile {
  id:           string;
  fullName:     string;
  role:         UserRole;
  tenantId:     string;
  isSuperAdmin: boolean;
  isActive:     boolean;
  phone?:       string;
  avatarUrl?:   string;
}

// ─── Car Wash (Outlet) ────────────────────────────────────────────────────────

export interface CarWash {
  id: string;
  name: string;
  address: string;
  phone: string;
  logo_url?: string;
  owner_id: string;
  subscription_plan: SubscriptionPlan;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Vehicle & Queue ──────────────────────────────────────────────────────────

export type VehicleType = 'motor' | 'mobil' | 'pickup' | 'bus' | 'truk';

export type QueueStatus = 'waiting' | 'in_progress' | 'done' | 'paid' | 'cancelled';

/** Backend status enum — dipakai di API layer */
export type BackendQueueStatus = 'queued' | 'in_progress' | 'completed' | 'paid' | 'cancelled';

export interface ServiceItem {
  service_id: string;
  service_name: string;
  price: number;
}

export interface QueueItem {
  id: string;
  carwash_id: string;
  queue_number: number;
  vehicle_type: VehicleType;
  vehicle_plate: string;
  customer_name?: string;
  brand?: string;
  services: ServiceItem[];
  status: QueueStatus;
  operator_id?: string;
  notes?: string;
  total_price: number;
  created_at: string;
  updated_at: string;
}

// ─── Services ─────────────────────────────────────────────────────────────────

export interface Service {
  id: string;
  carwash_id: string;
  category: string;
  /** Backend category_id — opsional, diisi saat integrasi */
  category_id?: string;
  name: string;
  description?: string;
  price: number;
  duration_minutes: number;
  vehicle_types: VehicleType[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Vehicle History ──────────────────────────────────────────────────────────

export interface VehicleSummary {
  id?: string;           // backend vehicle UUID
  plate: string;
  brand?: string;
  model?: string;
  vehicle_type: VehicleType;
  customer_name?: string;
  customer_id?: string;
  visit_count: number;
  total_spent: number;
  last_visit: string; // ISO string
  first_visit: string; // ISO string
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export interface DailyReport {
  date: string;
  total_queues: number;
  completed_queues: number;
  cancelled_queues: number;
  total_revenue: number;
  average_duration_minutes: number;
  by_vehicle_type: Partial<Record<VehicleType, number>>;
  by_service: Record<string, { count: number; revenue: number }>;
}

export interface ReportSummary {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
  total_revenue: number;
  total_queues: number;
  completed_queues: number;
  daily_breakdown: DailyReport[];
}

// ─── Subscription ─────────────────────────────────────────────────────────────

export type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'enterprise';

export interface SubscriptionFeatures {
  max_queues_per_day: number; // -1 = unlimited
  max_services: number;       // -1 = unlimited
  max_team_members: number;
  has_reports: boolean;
  has_kiosk_mode: boolean;
  has_multi_outlet: boolean;
  has_api_access: boolean;
}

export interface SubscriptionPlanDetail {
  plan: SubscriptionPlan;
  name: string;
  price_monthly: number; // IDR, 0 = free
  price_yearly: number;
  features: SubscriptionFeatures;
}

// ─── Team ─────────────────────────────────────────────────────────────────────

export interface TeamMember {
  id: string;
  user_id: string;
  carwash_id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone?: string;
  is_active: boolean;
  joined_at: string;
}

// ─── API / Generic Responses ──────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
