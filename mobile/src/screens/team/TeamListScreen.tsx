import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionSheet } from '../../components/common/ActionSheet';
import KIcon from '../../components/common/KIcon';
import { useTeamStore, type ExtendedTeamMember } from '../../store/teamStore';
import type { UserRole } from '../../types';

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<UserRole, string> = {
  owner: 'Owner',
  operator: 'Operator',
  kiosk_user: 'Kiosk',
};

const ROLE_COLORS: Record<UserRole, { bg: string; text: string }> = {
  owner: { bg: '#ede9fe', text: '#5b21b6' },
  operator: { bg: '#e0f2fe', text: '#0369a1' },
  kiosk_user: { bg: '#f1f5f9', text: '#475569' },
};

// ─── Forms ────────────────────────────────────────────────────────────────────

function InviteForm({
  onInvite,
}: {
  onInvite: (email: string, role: UserRole) => void;
}) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('operator');
  const isValid = email.includes('@') && email.length > 5;

  return (
    <View className="pb-4">
      <View className="mb-4">
        <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1.5">Alamat Email *</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="email@contoh.com"
          placeholderTextColor="#94a3b8"
          autoCapitalize="none"
          keyboardType="email-address"
          className="rounded-xl px-3.5 py-3 text-slate-800"
          style={{ borderColor: '#e2e8f0', borderWidth: 1.5, fontSize: 17 }}
          autoFocus
        />
      </View>
      <View className="mb-6">
        <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1.5">Peran *</Text>
        <View className="flex-row gap-2">
          {(['operator', 'owner'] as UserRole[]).map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => setRole(r)}
              className="flex-1 py-2.5 rounded-xl items-center"
              style={{
                backgroundColor: role === r ? '#eff6ff' : '#f8fafc',
                borderWidth: 1.5,
                borderColor: role === r ? '#2563eb' : '#e2e8f0',
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '700', color: role === r ? '#1d4ed8' : '#64748b' }}>
                {ROLE_LABELS[r]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => isValid && onInvite(email.trim(), role)}
        disabled={!isValid}
        className="w-full py-3.5 rounded-2xl items-center"
        style={{ backgroundColor: isValid ? '#2563eb' : '#e2e8f0' }}
      >
        <Text className="font-bold text-lg" style={{ color: isValid ? '#fff' : '#94a3b8' }}>
          Kirim Undangan
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function EditRoleForm({
  member,
  onSave,
  onDelete,
}: {
  member: ExtendedTeamMember;
  onSave: (role: UserRole) => void;
  onDelete: () => void;
}) {
  const [role, setRole] = useState<UserRole>(member.role);

  return (
    <View className="pb-4">
      <View className="mb-6">
        <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1.5">Ubah Peran</Text>
        <View className="flex-row gap-2">
          {(['operator', 'owner'] as UserRole[]).map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => setRole(r)}
              className="flex-1 py-2.5 rounded-xl items-center"
              style={{
                backgroundColor: role === r ? '#eff6ff' : '#f8fafc',
                borderWidth: 1.5,
                borderColor: role === r ? '#2563eb' : '#e2e8f0',
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '700', color: role === r ? '#1d4ed8' : '#64748b' }}>
                {ROLE_LABELS[r]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <TouchableOpacity
        onPress={() => onSave(role)}
        className="w-full py-3.5 rounded-2xl items-center mb-3"
        style={{ backgroundColor: '#2563eb' }}
      >
        <Text className="font-bold text-lg text-white">Simpan Perubahan</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onDelete}
        className="w-full py-3.5 rounded-2xl items-center"
        style={{ backgroundColor: '#fef2f2' }}
      >
        <Text className="font-bold text-lg text-red-500">Hapus Anggota</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function TeamListScreen({ navigation }: any) {
  const { members, inviteMember, updateMemberRole, removeMember } = useTeamStore();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editMember, setEditMember] = useState<ExtendedTeamMember | null>(null);

  const handleDelete = (id: string) => {
    Alert.alert('Hapus Anggota', 'Apakah Anda yakin ingin menghapus anggota ini dari tim?', [
      { text: 'Batal', style: 'cancel' },
      { 
        text: 'Hapus', 
        style: 'destructive', 
        onPress: () => {
          removeMember(id);
          setEditMember(null);
        }
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#f8fafc' }} edges={['top']}>
      {/* Header */}
      <View className="bg-white border-b border-slate-100 px-4 pt-3 pb-3 flex-row items-center gap-3">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-9 h-9 rounded-xl items-center justify-center"
          style={{ backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' }}
        >
          <KIcon name="chevron-left" size={18} color="#64748b" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>
            Pengaturan Outlet
          </Text>
          <Text style={{ fontSize: 24, fontWeight: '800', color: '#0f172a', marginTop: 2 }}>
            Tim & Akses
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 14, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-3">
          {members.map((member) => (
            <View
              key={member.id}
              className="bg-white rounded-2xl px-4 py-3.5 flex-row items-center gap-3"
              style={{ borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#0f172a', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 }}
            >
              {/* Avatar */}
              <View
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: member.status === 'invited' ? '#f1f5f9' : ROLE_COLORS[member.role].bg }}
              >
                <Text style={{ fontSize: 16, fontWeight: '800', color: member.status === 'invited' ? '#94a3b8' : ROLE_COLORS[member.role].text }}>
                  {member.full_name ? member.full_name.substring(0, 1).toUpperCase() : '?'}
                </Text>
              </View>

              {/* Info */}
              <View className="flex-1 justify-center">
                <View className="flex-row items-center gap-2 mb-1">
                  <Text style={{ fontSize: 17, fontWeight: '700', color: '#1e293b' }}>
                    {member.full_name || 'Menunggu Bergabung'}
                  </Text>
                  {member.status === 'invited' && (
                    <View className="px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200">
                      <Text style={{ fontSize: 11, fontWeight: '700', color: '#d97706', textTransform: 'uppercase' }}>Pending</Text>
                    </View>
                  )}
                </View>
                <Text style={{ fontSize: 14, color: '#64748b' }} numberOfLines={1}>
                  {member.email}
                </Text>
                <View className="flex-row mt-1.5">
                  <View
                    className="px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: ROLE_COLORS[member.role].bg }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '700', color: ROLE_COLORS[member.role].text, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {ROLE_LABELS[member.role]}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Actions */}
              <TouchableOpacity
                onPress={() => setEditMember(member)}
                className="w-9 h-9 rounded-xl items-center justify-center"
                style={{ backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' }}
              >
                <KIcon name="more" size={16} color="#64748b" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* FAB */}
      <View className="absolute bottom-6 right-4">
        <TouchableOpacity
          onPress={() => setInviteOpen(true)}
          className="items-center justify-center flex-row gap-2 px-4 py-3 rounded-full"
          style={{ backgroundColor: '#2563eb', shadowColor: '#2563eb', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.45, shadowRadius: 14, elevation: 10 }}
          activeOpacity={0.85}
        >
          <KIcon name="plus" size={24} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Undang Staf</Text>
        </TouchableOpacity>
      </View>

      <ActionSheet
        visible={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Undang Anggota Tim"
      >
        <InviteForm
          onInvite={(email, role) => {
            inviteMember(email, role);
            setInviteOpen(false);
          }}
        />
      </ActionSheet>

      <ActionSheet
        visible={editMember !== null}
        onClose={() => setEditMember(null)}
        title={editMember?.full_name || editMember?.email || 'Edit Anggota'}
      >
        {editMember && (
          <EditRoleForm
            member={editMember}
            onSave={(r) => {
              updateMemberRole(editMember.id, r);
              setEditMember(null);
            }}
            onDelete={() => handleDelete(editMember.id)}
          />
        )}
      </ActionSheet>
    </SafeAreaView>
  );
}
