/**
 * services/vehicleService.ts — Vehicle Database Service (Client-to-Supabase)
 *
 * Semua operasi data kendaraan langsung menggunakan Supabase client.
 */

import { supabase } from '../lib/supabase';
import type { VehicleSummary, VehicleType } from '../types';

// ─── Helper normalization ─────────────────────────────────────────────────────

function normalizePlate(plate: string): string {
  return plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

// ─── Field mappers ────────────────────────────────────────────────────────────

function backendToVehicleType(bt: string): VehicleType {
  const map: Record<string, VehicleType> = {
    car:        'mobil',
    motorcycle: 'motor',
    other:      'mobil',
    mobil:      'mobil',
    motor:      'motor',
    pickup:     'pickup',
    bus:        'bus',
    truk:       'truk',
  };
  return map[bt] ?? 'mobil';
}

function vehicleTypeToBackend(vt: VehicleType): string {
  const map: Record<VehicleType, string> = {
    motor:  'motorcycle',
    mobil:  'car',
    pickup: 'car',
    bus:    'other',
    truk:   'other',
  };
  return map[vt];
}

function mapVehicle(v: any): VehicleSummary {
  return {
    id:            v.id,
    plate:         v.plate_number,
    brand:         v.brand,
    model:         v.model,
    vehicle_type:  backendToVehicleType(v.vehicle_type),
    customer_name: v.customer?.name,
    customer_id:   v.customer?.id,
    visit_count:   v.visit_count ?? 0,
    total_spent:   v.customer?.total_spent ?? 0,
    last_visit:    v.last_visit_at ?? new Date().toISOString(),
    first_visit:   v.created_at  ?? new Date().toISOString(),
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const vehicleService = {

  fetchVehicles: async (outletId: string): Promise<{ vehicles: VehicleSummary[] }> => {
    // 1. Get tenant_id from outlet
    const { data: outlet, error: outletErr } = await supabase
      .from('outlets')
      .select('tenant_id')
      .eq('id', outletId)
      .single();

    if (outletErr || !outlet) {
      throw new Error(outletErr?.message || 'Outlet tidak ditemukan.');
    }

    const tenantId = outlet.tenant_id;

    // 2. Fetch vehicles belonging to this tenant_id, including customer details
    const { data, error } = await supabase
      .from('vehicles')
      .select('*, customer:customers(*)')
      .eq('tenant_id', tenantId);

    if (error) {
      throw new Error(error.message);
    }

    return {
      vehicles: (data ?? []).map(mapVehicle),
    };
  },

  getVehicleDetail: async (vehicleId: string): Promise<VehicleSummary | null> => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*, customer:customers(*)')
        .eq('id', vehicleId)
        .single();

      if (error || !data) return null;
      return mapVehicle(data);
    } catch {
      return null;
    }
  },

  getOrCreateCustomer: async (
    tenantId: string,
    name?: string,
    phone?: string
  ): Promise<string | null> => {
    if (!name && !phone) return null;

    const lookupPhone = phone?.trim() || '';
    if (lookupPhone) {
      const { data: existing } = await supabase
        .from('customers')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('phone', lookupPhone)
        .maybeSingle();

      if (existing) return existing.id;
    }

    const { data: created, error } = await supabase
      .from('customers')
      .insert({
        tenant_id: tenantId,
        name: name?.trim() || 'Pelanggan',
        phone: lookupPhone || null,
        total_visits: 0,
        total_spent: 0,
      })
      .select('id')
      .single();

    if (error || !created) {
      throw new Error(error?.message || 'Gagal membuat profil pelanggan.');
    }

    return created.id;
  },

  createVehicle: async (
    outletId:      string,
    plate:         string,
    vehicleType:   VehicleType,
    brand?:        string,
    model?:        string,
    vehicleSize?:  string,
    customerName?: string,
    customerPhone?: string,
  ): Promise<VehicleSummary> => {
    // 1. Get tenant_id
    const { data: outlet } = await supabase
      .from('outlets')
      .select('tenant_id')
      .eq('id', outletId)
      .single();

    const tenantId = outlet?.tenant_id || '';

    // 2. Get or create customer
    const customerId = await vehicleService.getOrCreateCustomer(tenantId, customerName, customerPhone);

    // 3. Create vehicle
    const plateNorm = normalizePlate(plate);
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .insert({
        tenant_id: tenantId,
        plate_number: plate.trim().toUpperCase(),
        plate_normalized: plateNorm,
        customer_id: customerId,
        vehicle_type: vehicleTypeToBackend(vehicleType),
        brand: brand?.trim() || null,
        model: model?.trim() || null,
        vehicle_size: vehicleSize || 'M',
        visit_count: 0,
      })
      .select('*, customer:customers(*)')
      .single();

    if (error || !vehicle) {
      throw new Error(error?.message || 'Gagal membuat kendaraan.');
    }

    return mapVehicle(vehicle);
  },

  updateVehicleNotes: async (vehicleId: string, notes: string): Promise<void> => {
    const { error } = await supabase
      .from('vehicles')
      .update({ notes })
      .eq('id', vehicleId);

    if (error) {
      throw new Error(error.message);
    }
  },

  checkPlate: async (outletId: string, plate: string): Promise<boolean> => {
    try {
      const { data: outlet } = await supabase
        .from('outlets')
        .select('tenant_id')
        .eq('id', outletId)
        .single();

      if (!outlet) return false;

      const plateNorm = normalizePlate(plate);
      const { data } = await supabase
        .from('vehicles')
        .select('id')
        .eq('tenant_id', outlet.tenant_id)
        .eq('plate_normalized', plateNorm)
        .maybeSingle();

      return !!data;
    } catch {
      return false;
    }
  },
};
