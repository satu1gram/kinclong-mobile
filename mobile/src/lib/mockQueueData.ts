import type { QueueItem, Service, VehicleSummary } from '../types';

// ─── Flat Service List (same as design system) ────────────────────────────────

export const MOCK_SERVICES: Service[] = [
  {
    id: 'basic',
    carwash_id: 'cw1',
    category: 'Cuci Mobil & Motor',
    name: 'Cuci Basic',
    price: 35_000,
    duration_minutes: 20,
    vehicle_types: ['motor', 'mobil', 'pickup', 'bus', 'truk'],
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'premium',
    carwash_id: 'cw1',
    category: 'Cuci Mobil & Motor',
    name: 'Cuci Premium',
    price: 65_000,
    duration_minutes: 35,
    vehicle_types: ['motor', 'mobil', 'pickup', 'bus', 'truk'],
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'wax',
    carwash_id: 'cw1',
    category: 'Detailing',
    name: 'Wax & Polish',
    price: 45_000,
    duration_minutes: 30,
    vehicle_types: ['motor', 'mobil', 'pickup', 'bus', 'truk'],
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'interior',
    carwash_id: 'cw1',
    category: 'Detailing',
    name: 'Detailing Interior',
    price: 80_000,
    duration_minutes: 45,
    vehicle_types: ['mobil', 'pickup', 'bus', 'truk'],
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'engine',
    carwash_id: 'cw1',
    category: 'Perawatan Tambahan',
    name: 'Cuci Mesin',
    price: 40_000,
    duration_minutes: 25,
    vehicle_types: ['mobil', 'pickup', 'bus', 'truk'],
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'poles',
    carwash_id: 'cw1',
    category: 'Detailing',
    name: 'Poles Body',
    price: 75_000,
    duration_minutes: 40,
    vehicle_types: ['mobil', 'pickup', 'bus', 'truk'],
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

export const MOCK_SERVICES_MAP: Record<string, Service> = Object.fromEntries(
  MOCK_SERVICES.map((s) => [s.id, s])
);

export function getAllServices(): Service[] {
  return MOCK_SERVICES;
}

// ─── Mock Queue Items ─────────────────────────────────────────────────────────

// ─── Vehicle Visit History ────────────────────────────────────────────────────

const dt = (daysAgo: number, hoursOff = 0) =>
  new Date(Date.now() - daysAgo * 86_400_000 - hoursOff * 3_600_000).toISOString();

export const MOCK_VEHICLE_VISITS: QueueItem[] = [
  // ── B 1234 ABC – Toyota Avanza (Budi Santoso) ─────────────────────────────
  { id: 'vh01', carwash_id: 'cw1', queue_number: 110, vehicle_type: 'mobil', vehicle_plate: 'B 1234 ABC', brand: 'Toyota Avanza', customer_name: 'Budi Santoso', services: [{ service_id: 'basic', service_name: 'Cuci Basic', price: 35_000 }, { service_id: 'wax', service_name: 'Wax & Polish', price: 45_000 }], status: 'paid', total_price: 80_000, created_at: dt(3, 2), updated_at: dt(3) },
  { id: 'vh02', carwash_id: 'cw1', queue_number: 98,  vehicle_type: 'mobil', vehicle_plate: 'B 1234 ABC', brand: 'Toyota Avanza', customer_name: 'Budi Santoso', services: [{ service_id: 'premium', service_name: 'Cuci Premium', price: 65_000 }], status: 'paid', total_price: 65_000, created_at: dt(10, 1), updated_at: dt(10) },
  { id: 'vh03', carwash_id: 'cw1', queue_number: 87,  vehicle_type: 'mobil', vehicle_plate: 'B 1234 ABC', brand: 'Toyota Avanza', customer_name: 'Budi Santoso', services: [{ service_id: 'basic', service_name: 'Cuci Basic', price: 35_000 }], status: 'paid', total_price: 35_000, created_at: dt(17, 3), updated_at: dt(17) },
  { id: 'vh04', carwash_id: 'cw1', queue_number: 76,  vehicle_type: 'mobil', vehicle_plate: 'B 1234 ABC', brand: 'Toyota Avanza', customer_name: 'Budi Santoso', services: [{ service_id: 'basic', service_name: 'Cuci Basic', price: 35_000 }, { service_id: 'interior', service_name: 'Detailing Interior', price: 80_000 }], status: 'paid', total_price: 115_000, created_at: dt(24, 2), updated_at: dt(24) },
  { id: 'vh05', carwash_id: 'cw1', queue_number: 65,  vehicle_type: 'mobil', vehicle_plate: 'B 1234 ABC', brand: 'Toyota Avanza', customer_name: 'Budi Santoso', services: [{ service_id: 'premium', service_name: 'Cuci Premium', price: 65_000 }, { service_id: 'wax', service_name: 'Wax & Polish', price: 45_000 }], status: 'paid', total_price: 110_000, created_at: dt(31, 1), updated_at: dt(31) },
  { id: 'vh06', carwash_id: 'cw1', queue_number: 52,  vehicle_type: 'mobil', vehicle_plate: 'B 1234 ABC', brand: 'Toyota Avanza', customer_name: 'Budi Santoso', services: [{ service_id: 'basic', service_name: 'Cuci Basic', price: 35_000 }], status: 'paid', total_price: 35_000, created_at: dt(40, 4), updated_at: dt(40) },
  { id: 'vh07', carwash_id: 'cw1', queue_number: 41,  vehicle_type: 'mobil', vehicle_plate: 'B 1234 ABC', brand: 'Toyota Avanza', customer_name: 'Budi Santoso', services: [{ service_id: 'poles', service_name: 'Poles Body', price: 75_000 }], status: 'paid', total_price: 75_000, created_at: dt(55, 2), updated_at: dt(55) },
  { id: 'vh08', carwash_id: 'cw1', queue_number: 28,  vehicle_type: 'mobil', vehicle_plate: 'B 1234 ABC', brand: 'Toyota Avanza', customer_name: 'Budi Santoso', services: [{ service_id: 'basic', service_name: 'Cuci Basic', price: 35_000 }, { service_id: 'wax', service_name: 'Wax & Polish', price: 45_000 }], status: 'paid', total_price: 80_000, created_at: dt(70, 3), updated_at: dt(70) },

  // ── BA 2342 MAS – Honda Jazz (Rina Dewi) ───────────────────────────────────
  { id: 'vh09', carwash_id: 'cw1', queue_number: 108, vehicle_type: 'mobil', vehicle_plate: 'BA 2342 MAS', brand: 'Honda Jazz', customer_name: 'Rina Dewi', services: [{ service_id: 'premium', service_name: 'Cuci Premium', price: 65_000 }], status: 'paid', total_price: 65_000, created_at: dt(5, 2), updated_at: dt(5) },
  { id: 'vh10', carwash_id: 'cw1', queue_number: 89,  vehicle_type: 'mobil', vehicle_plate: 'BA 2342 MAS', brand: 'Honda Jazz', customer_name: 'Rina Dewi', services: [{ service_id: 'basic', service_name: 'Cuci Basic', price: 35_000 }, { service_id: 'wax', service_name: 'Wax & Polish', price: 45_000 }], status: 'paid', total_price: 80_000, created_at: dt(18, 1), updated_at: dt(18) },
  { id: 'vh11', carwash_id: 'cw1', queue_number: 72,  vehicle_type: 'mobil', vehicle_plate: 'BA 2342 MAS', brand: 'Honda Jazz', customer_name: 'Rina Dewi', services: [{ service_id: 'premium', service_name: 'Cuci Premium', price: 65_000 }, { service_id: 'interior', service_name: 'Detailing Interior', price: 80_000 }], status: 'paid', total_price: 145_000, created_at: dt(40, 3), updated_at: dt(40) },
  { id: 'vh12', carwash_id: 'cw1', queue_number: 45,  vehicle_type: 'mobil', vehicle_plate: 'BA 2342 MAS', brand: 'Honda Jazz', customer_name: 'Rina Dewi', services: [{ service_id: 'basic', service_name: 'Cuci Basic', price: 35_000 }], status: 'paid', total_price: 35_000, created_at: dt(70, 2), updated_at: dt(70) },

  // ── N 2343 QWI – Yamaha Nmax (Agus Prasetyo) ──────────────────────────────
  { id: 'vh13', carwash_id: 'cw1', queue_number: 112, vehicle_type: 'motor', vehicle_plate: 'N 2343 QWI', brand: 'Yamaha Nmax', customer_name: 'Agus Prasetyo', services: [{ service_id: 'basic', service_name: 'Cuci Basic', price: 35_000 }], status: 'paid', total_price: 35_000, created_at: dt(1, 2), updated_at: dt(1) },
  { id: 'vh14', carwash_id: 'cw1', queue_number: 104, vehicle_type: 'motor', vehicle_plate: 'N 2343 QWI', brand: 'Yamaha Nmax', customer_name: 'Agus Prasetyo', services: [{ service_id: 'basic', service_name: 'Cuci Basic', price: 35_000 }], status: 'paid', total_price: 35_000, created_at: dt(4, 3), updated_at: dt(4) },
  { id: 'vh15', carwash_id: 'cw1', queue_number: 96,  vehicle_type: 'motor', vehicle_plate: 'N 2343 QWI', brand: 'Yamaha Nmax', customer_name: 'Agus Prasetyo', services: [{ service_id: 'basic', service_name: 'Cuci Basic', price: 35_000 }, { service_id: 'wax', service_name: 'Wax & Polish', price: 45_000 }], status: 'paid', total_price: 80_000, created_at: dt(8, 1), updated_at: dt(8) },
  { id: 'vh16', carwash_id: 'cw1', queue_number: 88,  vehicle_type: 'motor', vehicle_plate: 'N 2343 QWI', brand: 'Yamaha Nmax', customer_name: 'Agus Prasetyo', services: [{ service_id: 'basic', service_name: 'Cuci Basic', price: 35_000 }], status: 'paid', total_price: 35_000, created_at: dt(12, 2), updated_at: dt(12) },
  { id: 'vh17', carwash_id: 'cw1', queue_number: 80,  vehicle_type: 'motor', vehicle_plate: 'N 2343 QWI', brand: 'Yamaha Nmax', customer_name: 'Agus Prasetyo', services: [{ service_id: 'basic', service_name: 'Cuci Basic', price: 35_000 }], status: 'paid', total_price: 35_000, created_at: dt(16, 4), updated_at: dt(16) },
  { id: 'vh18', carwash_id: 'cw1', queue_number: 72,  vehicle_type: 'motor', vehicle_plate: 'N 2343 QWI', brand: 'Yamaha Nmax', customer_name: 'Agus Prasetyo', services: [{ service_id: 'basic', service_name: 'Cuci Basic', price: 35_000 }, { service_id: 'wax', service_name: 'Wax & Polish', price: 45_000 }], status: 'paid', total_price: 80_000, created_at: dt(20, 1), updated_at: dt(20) },
  { id: 'vh19', carwash_id: 'cw1', queue_number: 63,  vehicle_type: 'motor', vehicle_plate: 'N 2343 QWI', brand: 'Yamaha Nmax', customer_name: 'Agus Prasetyo', services: [{ service_id: 'basic', service_name: 'Cuci Basic', price: 35_000 }], status: 'paid', total_price: 35_000, created_at: dt(24, 3), updated_at: dt(24) },
  { id: 'vh20', carwash_id: 'cw1', queue_number: 54,  vehicle_type: 'motor', vehicle_plate: 'N 2343 QWI', brand: 'Yamaha Nmax', customer_name: 'Agus Prasetyo', services: [{ service_id: 'basic', service_name: 'Cuci Basic', price: 35_000 }], status: 'paid', total_price: 35_000, created_at: dt(28, 2), updated_at: dt(28) },
  { id: 'vh21', carwash_id: 'cw1', queue_number: 46,  vehicle_type: 'motor', vehicle_plate: 'N 2343 QWI', brand: 'Yamaha Nmax', customer_name: 'Agus Prasetyo', services: [{ service_id: 'basic', service_name: 'Cuci Basic', price: 35_000 }], status: 'paid', total_price: 35_000, created_at: dt(32, 1), updated_at: dt(32) },
  { id: 'vh22', carwash_id: 'cw1', queue_number: 38,  vehicle_type: 'motor', vehicle_plate: 'N 2343 QWI', brand: 'Yamaha Nmax', customer_name: 'Agus Prasetyo', services: [{ service_id: 'basic', service_name: 'Cuci Basic', price: 35_000 }, { service_id: 'wax', service_name: 'Wax & Polish', price: 45_000 }], status: 'paid', total_price: 80_000, created_at: dt(36, 3), updated_at: dt(36) },
  { id: 'vh23', carwash_id: 'cw1', queue_number: 30,  vehicle_type: 'motor', vehicle_plate: 'N 2343 QWI', brand: 'Yamaha Nmax', customer_name: 'Agus Prasetyo', services: [{ service_id: 'basic', service_name: 'Cuci Basic', price: 35_000 }], status: 'paid', total_price: 35_000, created_at: dt(42, 2), updated_at: dt(42) },
  { id: 'vh24', carwash_id: 'cw1', queue_number: 22,  vehicle_type: 'motor', vehicle_plate: 'N 2343 QWI', brand: 'Yamaha Nmax', customer_name: 'Agus Prasetyo', services: [{ service_id: 'basic', service_name: 'Cuci Basic', price: 35_000 }], status: 'paid', total_price: 35_000, created_at: dt(52, 4), updated_at: dt(52) },
  { id: 'vh25', carwash_id: 'cw1', queue_number: 15,  vehicle_type: 'motor', vehicle_plate: 'N 2343 QWI', brand: 'Yamaha Nmax', customer_name: 'Agus Prasetyo', services: [{ service_id: 'basic', service_name: 'Cuci Basic', price: 35_000 }], status: 'paid', total_price: 35_000, created_at: dt(63, 1), updated_at: dt(63) },
  { id: 'vh26', carwash_id: 'cw1', queue_number: 8,   vehicle_type: 'motor', vehicle_plate: 'N 2343 QWI', brand: 'Yamaha Nmax', customer_name: 'Agus Prasetyo', services: [{ service_id: 'basic', service_name: 'Cuci Basic', price: 35_000 }], status: 'paid', total_price: 35_000, created_at: dt(78, 2), updated_at: dt(78) },

  // ── AG 5512 KK – Mitsubishi Pajero (Wahyu Nugroho) ────────────────────────
  { id: 'vh27', carwash_id: 'cw1', queue_number: 105, vehicle_type: 'mobil', vehicle_plate: 'AG 5512 KK', brand: 'Mitsubishi Pajero', customer_name: 'Wahyu Nugroho', services: [{ service_id: 'premium', service_name: 'Cuci Premium', price: 65_000 }, { service_id: 'wax', service_name: 'Wax & Polish', price: 45_000 }, { service_id: 'interior', service_name: 'Detailing Interior', price: 80_000 }], status: 'paid', total_price: 190_000, created_at: dt(0, 2), updated_at: dt(0, 1) },
  { id: 'vh28', carwash_id: 'cw1', queue_number: 82,  vehicle_type: 'mobil', vehicle_plate: 'AG 5512 KK', brand: 'Mitsubishi Pajero', customer_name: 'Wahyu Nugroho', services: [{ service_id: 'premium', service_name: 'Cuci Premium', price: 65_000 }, { service_id: 'interior', service_name: 'Detailing Interior', price: 80_000 }], status: 'paid', total_price: 145_000, created_at: dt(18, 3), updated_at: dt(18) },
  { id: 'vh29', carwash_id: 'cw1', queue_number: 55,  vehicle_type: 'mobil', vehicle_plate: 'AG 5512 KK', brand: 'Mitsubishi Pajero', customer_name: 'Wahyu Nugroho', services: [{ service_id: 'poles', service_name: 'Poles Body', price: 75_000 }], status: 'paid', total_price: 75_000, created_at: dt(50, 2), updated_at: dt(50) },

  // ── B 3453 XL – Ford Ranger ────────────────────────────────────────────────
  { id: 'vh30', carwash_id: 'cw1', queue_number: 100, vehicle_type: 'pickup', vehicle_plate: 'B 3453 XL', brand: 'Ford Ranger', services: [{ service_id: 'premium', service_name: 'Cuci Premium', price: 65_000 }, { service_id: 'engine', service_name: 'Cuci Mesin', price: 40_000 }], status: 'paid', total_price: 105_000, created_at: dt(0, 3), updated_at: dt(0, 1) },
  { id: 'vh31', carwash_id: 'cw1', queue_number: 68,  vehicle_type: 'pickup', vehicle_plate: 'B 3453 XL', brand: 'Ford Ranger', services: [{ service_id: 'basic', service_name: 'Cuci Basic', price: 35_000 }], status: 'paid', total_price: 35_000, created_at: dt(25, 2), updated_at: dt(25) },
  { id: 'vh32', carwash_id: 'cw1', queue_number: 33,  vehicle_type: 'pickup', vehicle_plate: 'B 3453 XL', brand: 'Ford Ranger', services: [{ service_id: 'premium', service_name: 'Cuci Premium', price: 65_000 }], status: 'paid', total_price: 65_000, created_at: dt(65, 1), updated_at: dt(65) },

  // ── B 9087 CD – Toyota Rush ────────────────────────────────────────────────
  { id: 'vh33', carwash_id: 'cw1', queue_number: 99,  vehicle_type: 'mobil', vehicle_plate: 'B 9087 CD', brand: 'Toyota Rush', services: [{ service_id: 'basic', service_name: 'Cuci Basic', price: 35_000 }, { service_id: 'wax', service_name: 'Wax & Polish', price: 45_000 }], status: 'paid', total_price: 80_000, created_at: dt(3, 4), updated_at: dt(3, 1) },
  { id: 'vh34', carwash_id: 'cw1', queue_number: 61,  vehicle_type: 'mobil', vehicle_plate: 'B 9087 CD', brand: 'Toyota Rush', services: [{ service_id: 'premium', service_name: 'Cuci Premium', price: 65_000 }], status: 'paid', total_price: 65_000, created_at: dt(35, 2), updated_at: dt(35) },

  // ── L 2211 XX – Honda City ─────────────────────────────────────────────────
  { id: 'vh35', carwash_id: 'cw1', queue_number: 94,  vehicle_type: 'mobil', vehicle_plate: 'L 2211 XX', brand: 'Honda City', services: [{ service_id: 'premium', service_name: 'Cuci Premium', price: 65_000 }], status: 'paid', total_price: 65_000, created_at: dt(5, 3), updated_at: dt(5, 1) },
  { id: 'vh36', carwash_id: 'cw1', queue_number: 58,  vehicle_type: 'mobil', vehicle_plate: 'L 2211 XX', brand: 'Honda City', services: [{ service_id: 'basic', service_name: 'Cuci Basic', price: 35_000 }], status: 'paid', total_price: 35_000, created_at: dt(45, 2), updated_at: dt(45) },

  // ── D 6677 YY – Suzuki Ertiga ─────────────────────────────────────────────
  { id: 'vh37', carwash_id: 'cw1', queue_number: 107, vehicle_type: 'motor', vehicle_plate: 'D 6677 YY', brand: 'Suzuki Ertiga', services: [{ service_id: 'basic', service_name: 'Cuci Basic', price: 35_000 }, { service_id: 'interior', service_name: 'Detailing Interior', price: 80_000 }], status: 'paid', total_price: 115_000, created_at: dt(7, 2), updated_at: dt(7) },
  { id: 'vh38', carwash_id: 'cw1', queue_number: 77,  vehicle_type: 'motor', vehicle_plate: 'D 6677 YY', brand: 'Suzuki Ertiga', services: [{ service_id: 'basic', service_name: 'Cuci Basic', price: 35_000 }], status: 'paid', total_price: 35_000, created_at: dt(28, 4), updated_at: dt(28) },
  { id: 'vh39', carwash_id: 'cw1', queue_number: 44,  vehicle_type: 'motor', vehicle_plate: 'D 6677 YY', brand: 'Suzuki Ertiga', services: [{ service_id: 'premium', service_name: 'Cuci Premium', price: 65_000 }], status: 'paid', total_price: 65_000, created_at: dt(58, 1), updated_at: dt(58) },
  { id: 'vh40', carwash_id: 'cw1', queue_number: 19,  vehicle_type: 'motor', vehicle_plate: 'D 6677 YY', brand: 'Suzuki Ertiga', services: [{ service_id: 'basic', service_name: 'Cuci Basic', price: 35_000 }, { service_id: 'wax', service_name: 'Wax & Polish', price: 45_000 }], status: 'paid', total_price: 80_000, created_at: dt(80, 3), updated_at: dt(80) },
];

export function getVehicleList(): VehicleSummary[] {
  const map = new Map<string, VehicleSummary>();
  for (const v of MOCK_VEHICLE_VISITS) {
    const existing = map.get(v.vehicle_plate);
    if (existing) {
      existing.visit_count++;
      existing.total_spent += v.total_price;
      if (v.updated_at > existing.last_visit)  existing.last_visit  = v.updated_at;
      if (v.updated_at < existing.first_visit) existing.first_visit = v.updated_at;
    } else {
      map.set(v.vehicle_plate, {
        plate: v.vehicle_plate,
        brand: v.brand,
        vehicle_type: v.vehicle_type,
        customer_name: v.customer_name,
        visit_count: 1,
        total_spent: v.total_price,
        last_visit: v.updated_at,
        first_visit: v.updated_at,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.last_visit.localeCompare(a.last_visit));
}

export function getVehicleVisits(plate: string): QueueItem[] {
  return MOCK_VEHICLE_VISITS
    .filter((v) => v.vehicle_plate === plate)
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

// ─── Mock Queue Items ─────────────────────────────────────────────────────────

export const MOCK_QUEUES: QueueItem[] = [
  {
    id: 'q1',
    carwash_id: 'cw1',
    queue_number: 1,
    vehicle_type: 'mobil',
    vehicle_plate: 'B 1234 ABC',
    brand: 'Toyota Avanza',
    customer_name: 'Budi Santoso',
    services: [
      { service_id: 'basic',   service_name: 'Cuci Basic',   price: 35_000 },
      { service_id: 'wax',     service_name: 'Wax & Polish', price: 45_000 },
    ],
    status: 'in_progress',
    total_price: 80_000,
    created_at: new Date(Date.now() - 14 * 60_000).toISOString(),
    updated_at: new Date(Date.now() - 8  * 60_000).toISOString(),
  },
  {
    id: 'q2',
    carwash_id: 'cw1',
    queue_number: 2,
    vehicle_type: 'mobil',
    vehicle_plate: 'BA 2342 MAS',
    brand: 'Honda Jazz',
    customer_name: 'Rina Dewi',
    services: [
      { service_id: 'premium', service_name: 'Cuci Premium', price: 65_000 },
    ],
    status: 'waiting',
    total_price: 65_000,
    created_at: new Date(Date.now() - 10 * 60_000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 60_000).toISOString(),
  },
  {
    id: 'q3',
    carwash_id: 'cw1',
    queue_number: 3,
    vehicle_type: 'motor',
    vehicle_plate: 'N 2343 QWI',
    brand: 'Yamaha Nmax',
    customer_name: 'Agus Prasetyo',
    services: [
      { service_id: 'basic',   service_name: 'Cuci Basic',   price: 35_000 },
    ],
    status: 'in_progress',
    total_price: 35_000,
    created_at: new Date(Date.now() - 22 * 60_000).toISOString(),
    updated_at: new Date(Date.now() - 8  * 60_000).toISOString(),
  },
  {
    id: 'q4',
    carwash_id: 'cw1',
    queue_number: 4,
    vehicle_type: 'mobil',
    vehicle_plate: 'L 9871 UY',
    brand: 'Honda Brio',
    customer_name: 'Siti Rahayu',
    services: [
      { service_id: 'basic',    service_name: 'Cuci Basic',          price: 35_000 },
      { service_id: 'interior', service_name: 'Detailing Interior',  price: 80_000 },
    ],
    status: 'waiting',
    total_price: 115_000,
    created_at: new Date(Date.now() - 30 * 60_000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 60_000).toISOString(),
  },
  {
    id: 'q5',
    carwash_id: 'cw1',
    queue_number: 5,
    vehicle_type: 'pickup',
    vehicle_plate: 'B 3453 XL',
    brand: 'Ford Ranger',
    services: [
      { service_id: 'premium', service_name: 'Cuci Premium', price: 65_000 },
      { service_id: 'engine',  service_name: 'Cuci Mesin',   price: 40_000 },
    ],
    status: 'done',
    total_price: 105_000,
    created_at: new Date(Date.now() - 55 * 60_000).toISOString(),
    updated_at: new Date(Date.now() - 5  * 60_000).toISOString(),
  },
  {
    id: 'q6',
    carwash_id: 'cw1',
    queue_number: 6,
    vehicle_type: 'mobil',
    vehicle_plate: 'AG 5512 KK',
    brand: 'Mitsubishi Pajero',
    customer_name: 'Wahyu Nugroho',
    services: [
      { service_id: 'premium',  service_name: 'Cuci Premium',       price: 65_000 },
      { service_id: 'wax',      service_name: 'Wax & Polish',       price: 45_000 },
      { service_id: 'interior', service_name: 'Detailing Interior', price: 80_000 },
    ],
    status: 'paid',
    total_price: 190_000,
    created_at: new Date(Date.now() - 90 * 60_000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 60_000).toISOString(),
  },
];
