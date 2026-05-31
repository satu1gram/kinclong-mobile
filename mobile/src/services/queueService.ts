/**
 * services/queueService.ts — Queue & Visit Database Service (Client-to-Supabase)
 *
 * Semua operasi antrian terhubung langsung ke tabel Supabase.
 */

import { supabase } from '../lib/supabase';
import type { QueueItem, QueueStatus, BackendQueueStatus, VehicleType, ServiceItem } from '../types';

// ─── Helper normalization ─────────────────────────────────────────────────────

function normalizePlate(plate: string): string {
  return plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

// ─── Field mappers ────────────────────────────────────────────────────────────

function mapVehicleType(bt: string): VehicleType {
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

function mapStatus(bs: string): QueueStatus {
  const map: Record<string, QueueStatus> = {
    queued:      'waiting',
    in_progress: 'in_progress',
    completed:   'done',
    paid:        'paid',
    cancelled:   'cancelled',
  };
  return map[bs] ?? 'waiting';
}

function mapStatusToBackend(status: QueueStatus): BackendQueueStatus {
  const map: Record<QueueStatus, BackendQueueStatus> = {
    waiting:     'queued',
    in_progress: 'in_progress',
    done:        'completed',
    paid:        'paid',
    cancelled:   'cancelled',
  };
  return map[status];
}

function mapVehicleTypeToBackend(vt: VehicleType): string {
  const map: Record<VehicleType, string> = {
    motor:  'motorcycle',
    mobil:  'car',
    pickup: 'car',
    bus:    'other',
    truk:   'other',
  };
  return map[vt];
}

function mapVisit(v: any, outletId: string): QueueItem {
  const services: ServiceItem[] = (v.visit_services ?? []).map((vs: any) => ({
    service_id: vs.service_id,
    service_name: vs.service?.name || 'Layanan',
    price: Number(vs.price || vs.service?.price_car || 0),
  }));

  const vehiclePlate = v.vehicle?.plate_number || v.plate_number || '';
  const customerName = v.customer?.name || v.vehicle?.customer?.name || '';
  const brand = v.vehicle?.brand || '';

  return {
    id: v.id,
    carwash_id: v.tenant_id || '',
    queue_number: v.queue_number || 0,
    vehicle_type: mapVehicleType(v.vehicle?.vehicle_type || 'car'),
    vehicle_plate: vehiclePlate,
    customer_name: customerName || undefined,
    brand: brand || undefined,
    services,
    status: mapStatus(v.status),
    operator_id: v.operator_id || undefined,
    notes: v.notes || undefined,
    total_price: Number(v.total_price || 0),
    created_at: v.created_at || new Date().toISOString(),
    updated_at: v.updated_at || new Date().toISOString(),
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const queueService = {

  fetchQueue: async (outletId: string): Promise<QueueItem[]> => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from('vehicle_visits')
      .select('*, vehicle:vehicles(*, customer:customers(*)), customer:customers(*), visit_services(*, service:services(*))')
      .eq('outlet_id', outletId)
      .gte('created_at', startOfDay.toISOString())
      .lte('created_at', endOfDay.toISOString())
      .order('queue_number', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map((v) => mapVisit(v, outletId));
  },

  createVisit: async (
    outletId:    string,
    vehicleId:   string | undefined,
    plate:       string,
    vehicleType: VehicleType,
    brand:       string | undefined,
    serviceIds:  string[],
    totalPrice:  number,
    notes:       string | undefined,
  ): Promise<QueueItem> => {
    // 1. Get tenant_id from outlet
    const { data: outlet } = await supabase
      .from('outlets')
      .select('tenant_id')
      .eq('id', outletId)
      .single();
    const tenantId = outlet?.tenant_id || '';

    // 2. Check or create vehicle
    const plateNorm = normalizePlate(plate);
    let { data: existingVehicle } = await supabase
      .from('vehicles')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('plate_normalized', plateNorm)
      .maybeSingle();

    let targetVehicleId = existingVehicle?.id;
    let targetCustomerId = existingVehicle?.customer_id;

    if (!existingVehicle) {
      const { data: newVehicle, error: vehicleErr } = await supabase
        .from('vehicles')
        .insert({
          tenant_id: tenantId,
          plate_number: plate.trim().toUpperCase(),
          plate_normalized: plateNorm,
          vehicle_type: mapVehicleTypeToBackend(vehicleType),
          brand: brand?.trim() || null,
          visit_count: 0,
          vehicle_size: vehicleType === 'motor' ? 'S' : 'M',
        })
        .select()
        .single();

      if (vehicleErr || !newVehicle) {
        throw new Error(vehicleErr?.message || 'Gagal membuat data kendaraan.');
      }
      targetVehicleId = newVehicle.id;
      targetCustomerId = newVehicle.customer_id;
    }

    // 3. Generate queue number for today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const { data: lastVisits } = await supabase
      .from('vehicle_visits')
      .select('queue_number')
      .eq('outlet_id', outletId)
      .gte('created_at', startOfDay.toISOString())
      .lte('created_at', endOfDay.toISOString())
      .order('queue_number', { ascending: false })
      .limit(1);

    let nextQueueNumber = 1;
    if (lastVisits && lastVisits.length > 0) {
      nextQueueNumber = (lastVisits[0].queue_number || 0) + 1;
    }

    // 4. Create visit
    const { data: visit, error: visitErr } = await supabase
      .from('vehicle_visits')
      .insert({
        tenant_id: tenantId,
        outlet_id: outletId,
        vehicle_id: targetVehicleId,
        customer_id: targetCustomerId || null,
        queue_number: nextQueueNumber,
        status: 'queued',
        total_price: totalPrice,
        final_price: totalPrice,
        notes: notes || null,
      })
      .select()
      .single();

    if (visitErr || !visit) {
      throw new Error(visitErr?.message || 'Gagal membuat antrian kunjungan.');
    }

    // 5. Insert services snapshot
    if (serviceIds.length > 0) {
      const { data: servicesList } = await supabase
        .from('services')
        .select('id, price_car, price_motorcycle')
        .in('id', serviceIds);

      const visitServicesPayload = serviceIds.map((sid) => {
        const svc = servicesList?.find((s) => s.id === sid);
        const priceVal = vehicleType === 'motor'
          ? (svc?.price_motorcycle ?? 0)
          : (svc?.price_car ?? 0);

        return {
          visit_id: visit.id,
          service_id: sid,
          quantity: 1,
          price: priceVal,
        };
      });

      const { error: servicesErr } = await supabase
        .from('visit_services')
        .insert(visitServicesPayload);

      if (servicesErr) {
        throw new Error(servicesErr.message);
      }
    }

    // 6. Update vehicle stats
    const currentVisitCount = (existingVehicle?.visit_count || 0) + 1;
    await supabase
      .from('vehicles')
      .update({
        visit_count: currentVisitCount,
        last_visit_at: new Date().toISOString(),
      })
      .eq('id', targetVehicleId);

    // Update customer stats
    if (targetCustomerId) {
      const { data: customer } = await supabase
        .from('customers')
        .select('total_visits, total_spent')
        .eq('id', targetCustomerId)
        .single();

      if (customer) {
        await supabase
          .from('customers')
          .update({
            total_visits: (customer.total_visits || 0) + 1,
            total_spent: (customer.total_spent || 0) + totalPrice,
            last_visit_at: new Date().toISOString(),
          })
          .eq('id', targetCustomerId);
      }
    }

    // 7. Load fully joined visit
    const { data: completeVisit, error: fetchErr } = await supabase
      .from('vehicle_visits')
      .select('*, vehicle:vehicles(*, customer:customers(*)), customer:customers(*), visit_services(*, service:services(*))')
      .eq('id', visit.id)
      .single();

    if (fetchErr || !completeVisit) {
      throw new Error(fetchErr?.message || 'Gagal memuat ulang data antrian.');
    }

    return mapVisit(completeVisit, outletId);
  },

  updateStatus: async (id: string, status: QueueStatus): Promise<void> => {
    const backendStatus = mapStatusToBackend(status);
    const { error } = await supabase
      .from('vehicle_visits')
      .update({ status: backendStatus })
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  },

  processPayment: async (
    id:            string,
    paymentMethod: string,
    discount:      number,
    finalPrice:    number,
  ): Promise<void> => {
    const { error } = await supabase
      .from('vehicle_visits')
      .update({
        status: 'paid',
        discount: discount,
        final_price: finalPrice,
      })
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  },

  cancelVisit: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('vehicle_visits')
      .update({ status: 'cancelled' })
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  },

  fetchHistory: async (outletId: string): Promise<QueueItem[]> => {
    const { data, error } = await supabase
      .from('vehicle_visits')
      .select('*, vehicle:vehicles(*, customer:customers(*)), customer:customers(*), visit_services(*, service:services(*))')
      .eq('outlet_id', outletId)
      .in('status', ['paid', 'cancelled'])
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map((v) => mapVisit(v, outletId));
  },

  searchVehicle: async (outletId: string, plate: string): Promise<{ id: string; plateNumber: string; brand?: string; vehicleType?: string } | null> => {
    try {
      const { data: outlet } = await supabase
        .from('outlets')
        .select('tenant_id')
        .eq('id', outletId)
        .single();
      if (!outlet) return null;

      const plateNorm = normalizePlate(plate);
      const { data } = await supabase
        .from('vehicles')
        .select('id, plate_number, brand, vehicle_type')
        .eq('tenant_id', outlet.tenant_id)
        .eq('plate_normalized', plateNorm)
        .limit(1);

      if (data && data.length > 0) {
        return {
          id: data[0].id,
          plateNumber: data[0].plate_number,
          brand: data[0].brand,
          vehicleType: mapVehicleType(data[0].vehicle_type),
        };
      }
      return null;
    } catch {
      return null;
    }
  },
};
