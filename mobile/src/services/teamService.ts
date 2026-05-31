/**
 * services/teamService.ts — Team Management Database Service (Client-to-Supabase)
 *
 * Mengelola anggota tim dan undangan langsung di database Supabase.
 */

import { supabase } from '../lib/supabase';
import type { UserRole } from '../types';
import type { ExtendedTeamMember } from '../store/teamStore';

// ─── Mappers ───────────────────────────────────────────────────────────────────

function mapMember(m: any): ExtendedTeamMember {
  return {
    id:         m.id,
    user_id:    m.id,
    carwash_id: '',
    role:       m.role,
    full_name:  m.full_name ?? '',
    email:      m.email || '',
    phone:      m.phone || undefined,
    is_active:  m.is_active,
    joined_at:  m.created_at || new Date().toISOString(),
    status:     'active',
  };
}

function mapInvitation(inv: any): ExtendedTeamMember {
  return {
    id:         inv.id,
    user_id:    '',
    carwash_id: '',
    role:       inv.role,
    full_name:  '',
    email:      inv.email,
    is_active:  false,
    joined_at:  inv.created_at || new Date().toISOString(),
    status:     'invited',
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const teamService = {

  fetchTeam: async (tenantId: string): Promise<ExtendedTeamMember[]> => {
    // 1. Fetch profiles (anggota aktif)
    const { data: members, error: membersErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('tenant_id', tenantId);

    if (membersErr) {
      throw new Error(membersErr.message);
    }

    // 2. Fetch invitations (undangan pending)
    const { data: invitations, error: invErr } = await supabase
      .from('user_invitations')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('status', 'pending');

    if (invErr) {
      throw new Error(invErr.message);
    }

    const mappedMembers     = (members ?? []).map(mapMember);
    const mappedInvitations = (invitations ?? []).map(mapInvitation);

    return [...mappedMembers, ...mappedInvitations];
  },

  inviteMember: async (
    tenantId: string,
    email:    string,
    role:     UserRole,
  ): Promise<ExtendedTeamMember> => {
    const { data, error } = await supabase
      .from('user_invitations')
      .insert({
        tenant_id:  tenantId,
        email:      email.trim().toLowerCase(),
        role:       role,
        status:     'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'Gagal mengirimkan undangan.');
    }

    return mapInvitation(data);
  },

  updateMemberRole: async (profileId: string, role: UserRole): Promise<void> => {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', profileId);

    if (error) {
      throw new Error(error.message);
    }
  },

  deactivateMember: async (profileId: string): Promise<void> => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: false })
      .eq('id', profileId);

    if (error) {
      throw new Error(error.message);
    }
  },

  cancelInvitation: async (invitationId: string): Promise<void> => {
    const { error } = await supabase
      .from('user_invitations')
      .update({ status: 'cancelled' })
      .eq('id', invitationId);

    if (error) {
      throw new Error(error.message);
    }
  },
};
