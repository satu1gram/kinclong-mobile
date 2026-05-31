/**
 * store/teamStore.ts — Team State Management (API-connected)
 *
 * Menggantikan MOCK_TEAM dengan real API calls ke backend Kinclong.
 */

import { create } from 'zustand';
import type { TeamMember, UserRole } from '../types';
import { teamService } from '../services/teamService';
import { authService } from '../lib/authService';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ExtendedTeamMember extends TeamMember {
  status: 'active' | 'invited';
}

interface TeamState {
  members:   ExtendedTeamMember[];
  isLoading: boolean;
  error:     string | null;
  tenantId:  string | null;

  initialize:       () => Promise<void>;
  fetchTeam:        () => Promise<void>;
  setMembers:       (members: ExtendedTeamMember[]) => void;
  inviteMember:     (email: string, role: UserRole) => Promise<void>;
  updateMemberRole: (id: string, role: UserRole) => Promise<void>;
  removeMember:     (id: string) => Promise<void>;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useTeamStore = create<TeamState>((set, get) => ({
  members:   [],
  isLoading: false,
  error:     null,
  tenantId:  null,

  // ── initialize ──────────────────────────────────────────────
  initialize: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });

    try {
      const tenantId = await authService.getTenantId();
      if (!tenantId) {
        set({ isLoading: false, error: 'Tenant belum dikonfigurasi.' });
        return;
      }
      set({ tenantId });
      const members = await teamService.fetchTeam(tenantId);
      set({ members, isLoading: false });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat data tim.';
      set({ isLoading: false, error: msg });
    }
  },

  // ── fetchTeam ────────────────────────────────────────────────
  fetchTeam: async () => {
    const { tenantId } = get();
    if (!tenantId) { await get().initialize(); return; }

    set({ isLoading: true, error: null });
    try {
      const members = await teamService.fetchTeam(tenantId);
      set({ members, isLoading: false });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat data tim.';
      set({ isLoading: false, error: msg });
    }
  },

  setMembers: (members) => set({ members }),

  // ── inviteMember ─────────────────────────────────────────────
  inviteMember: async (email, role) => {
    const { tenantId } = get();
    if (!tenantId) throw new Error('Tenant belum dikonfigurasi.');

    // Optimistic placeholder
    const tempId = `temp_${Date.now()}`;
    const tempMember: ExtendedTeamMember = {
      id:         tempId,
      user_id:    '',
      carwash_id: tenantId,
      role,
      full_name:  '',
      email:      email.trim().toLowerCase(),
      is_active:  false,
      joined_at:  new Date().toISOString(),
      status:     'invited',
    };
    set((s) => ({ members: [...s.members, tempMember] }));

    try {
      const invited = await teamService.inviteMember(tenantId, email, role);
      set((s) => ({
        members: s.members.map((m) => (m.id === tempId ? invited : m)),
      }));
    } catch (err) {
      set((s) => ({ members: s.members.filter((m) => m.id !== tempId) }));
      throw err;
    }
  },

  // ── updateMemberRole ─────────────────────────────────────────
  updateMemberRole: async (id, role) => {
    const { members } = get();

    // Optimistic
    set((s) => ({
      members: s.members.map((m) => (m.id === id ? { ...m, role } : m)),
    }));

    try {
      await teamService.updateMemberRole(id, role);
    } catch (err) {
      set({ members }); // rollback
      throw err;
    }
  },

  // ── removeMember ─────────────────────────────────────────────
  removeMember: async (id) => {
    const { members } = get();
    const target = members.find((m) => m.id === id);

    // Optimistic removal
    set((s) => ({ members: s.members.filter((m) => m.id !== id) }));

    try {
      if (target?.status === 'invited') {
        await teamService.cancelInvitation(id);
      } else {
        await teamService.deactivateMember(id);
      }
    } catch (err) {
      set({ members }); // rollback
      throw err;
    }
  },
}));
