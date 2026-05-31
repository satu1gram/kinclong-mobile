/**
 * services/serviceApiService.ts — Service/Layanan Database Service (Client-to-Supabase)
 *
 * Mengelola operasi CRUD menu layanan langsung di database Supabase.
 */

import { supabase } from '../lib/supabase';
import type { Service, VehicleType } from '../types';

// ─── Vehicle size ↔ VehicleType[] ────────────────────────────────────────────

function vehicleSizeToTypes(size?: string): VehicleType[] {
  const map: Record<string, VehicleType[]> = {
    S:  ['motor'],
    M:  ['mobil'],
    L:  ['mobil', 'pickup'],
    XL: ['pickup', 'bus'],
    OR: ['truk'],
  };
  return map[size ?? 'M'] ?? ['mobil'];
}

function typesToVehicleSize(types: VehicleType[]): string {
  if (types.includes('truk')) return 'OR';
  if (types.includes('bus')) return 'XL';
  if (types.includes('pickup')) return 'L';
  if (types.includes('motor')) return 'S';
  return 'M';
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

function mapService(s: any, categoryName: string, tenantId: string): Service {
  const price = s.price_car ?? s.price ?? 0;

  return {
    id:               s.id,
    carwash_id:       tenantId,
    category:         categoryName,
    category_id:      s.category_id,
    name:             s.name,
    price:            Number(price),
    duration_minutes: s.duration_minutes ?? 0,
    vehicle_types:    vehicleSizeToTypes(s.vehicle_size),
    is_active:        s.is_active,
    created_at:       s.created_at ?? new Date().toISOString(),
    updated_at:       s.updated_at ?? new Date().toISOString(),
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const serviceApiService = {

  fetchServices: async (tenantId: string): Promise<Service[]> => {
    const { data: categories, error } = await supabase
      .from('service_categories')
      .select('*, services(*)')
      .eq('tenant_id', tenantId);

    if (error) {
      throw new Error(error.message);
    }

    const allServices: Service[] = [];
    for (const cat of (categories ?? [])) {
      for (const s of (cat.services ?? [])) {
        allServices.push(mapService(s, cat.name, tenantId));
      }
    }
    return allServices;
  },

  getOrCreateCategory: async (tenantId: string, name: string): Promise<string> => {
    const { data: existing } = await supabase
      .from('service_categories')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('name', name)
      .maybeSingle();

    if (existing) {
      return existing.id;
    }

    const { data: created, error } = await supabase
      .from('service_categories')
      .insert({
        tenant_id: tenantId,
        name: name,
        is_active: true,
      })
      .select('id')
      .single();

    if (error || !created) {
      throw new Error(error?.message || 'Gagal membuat kategori layanan');
    }

    return created.id;
  },

  createService: async (
    tenantId: string,
    service: Omit<Service, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Service> => {
    const categoryId = await serviceApiService.getOrCreateCategory(tenantId, service.category);
    
    const priceVal = Number(service.price);

    const { data, error } = await supabase
      .from('services')
      .insert({
        tenant_id: tenantId,
        category_id: categoryId,
        name: service.name,
        price_car: priceVal,
        price_motorcycle: priceVal,
        price_suv: priceVal,
        vehicle_size: typesToVehicleSize(service.vehicle_types),
        duration_minutes: service.duration_minutes,
        is_active: service.is_active,
      })
      .select('*')
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'Gagal membuat layanan.');
    }

    return mapService(data, service.category, tenantId);
  },

  updateService: async (
    tenantId: string,
    id: string,
    updates: Partial<Service>
  ): Promise<void> => {
    const payload: any = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.price !== undefined) {
      payload.price_car = updates.price;
      payload.price_motorcycle = updates.price;
      payload.price_suv = updates.price;
    }
    if (updates.duration_minutes !== undefined) payload.duration_minutes = updates.duration_minutes;
    if (updates.vehicle_types !== undefined) {
      payload.vehicle_size = typesToVehicleSize(updates.vehicle_types);
    }
    if (updates.is_active !== undefined) payload.is_active = updates.is_active;

    if (updates.category !== undefined) {
      const categoryId = await serviceApiService.getOrCreateCategory(tenantId, updates.category);
      payload.category_id = categoryId;
    }

    const { error } = await supabase
      .from('services')
      .update(payload)
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  },

  deleteService: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  },

  toggleServiceActive: async (id: string): Promise<void> => {
    const { data, error: fetchErr } = await supabase
      .from('services')
      .select('is_active')
      .eq('id', id)
      .single();

    if (fetchErr || !data) {
      throw new Error(fetchErr?.message || 'Layanan tidak ditemukan.');
    }

    const { error: updateErr } = await supabase
      .from('services')
      .update({ is_active: !data.is_active })
      .eq('id', id);

    if (updateErr) {
      throw new Error(updateErr.message);
    }
  },
};
