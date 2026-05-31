import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage — wajib agar authService persist tidak crash di JSDOM
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock URL polyfill (tidak diperlukan di environment test)
jest.mock('react-native-url-polyfill/auto', () => {});

// Silence "useNativeDriver" warning dari React Native Animated di test
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}), {
  virtual: true,
});

// ─── Database & Auth Emulator ──────────────────────────────────────────────────

const db: Record<string, any[]> = {
  profiles: [],
  tenants: [],
  outlets: [],
  customers: [],
  vehicles: [],
  services: [],
  service_categories: [],
  vehicle_visits: [],
  visit_services: [],
  user_invitations: [],
};

function seedDefaultData() {
  db.profiles = [{
    id: 'demo-user-id',
    tenant_id: 'mock-tenant-id',
    full_name: 'Demo Owner',
    role: 'owner',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }];
  
  db.tenants = [{
    id: 'mock-tenant-id',
    name: 'Mock Carwash',
    subscription_plan: 'free',
    subscription_status: 'active',
  }];
  
  db.outlets = [{
    id: 'mock-outlet-id',
    tenant_id: 'mock-tenant-id',
    name: 'Mock Branch',
    is_active: true,
  }];
  
  db.service_categories = [
    {
      id: 'cat-1',
      tenant_id: 'mock-tenant-id',
      name: 'Cuci Kendaraan',
      is_active: true,
    }
  ];

  db.services = [
    {
      id: 'svc-1',
      category_id: 'cat-1',
      name: 'Cuci Body',
      price_car: 50000,
      price_motorcycle: 30000,
      duration_minutes: 30,
      is_active: true,
    }
  ];
}

seedDefaultData();

const mockUsers = new Map<string, any>();
mockUsers.set('demo@kinclong.id', {
  id: 'demo-user-id',
  email: 'demo@kinclong.id',
  password: 'password123',
  full_name: 'Demo Owner',
});

let currentAuthUser: any = null;
const mockAuthChangeListeners: Array<(event: string, session: any) => void> = [];

const mockSupabase = {
  auth: {
    signInWithPassword: jest.fn(async ({ email, password }) => {
      const user = mockUsers.get(email);
      if (user && user.password === password) {
        currentAuthUser = user;
        const session = {
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token',
          expires_in: 3600,
          user,
        };
        
        // pastikan profil ada di DB
        if (!db.profiles.some(p => p.id === user.id)) {
          db.profiles.push({
            id: user.id,
            tenant_id: 'mock-tenant-id',
            full_name: user.full_name || 'Demo Owner',
            role: 'owner',
            is_active: true,
          });
        }

        mockAuthChangeListeners.forEach((cb) => cb('SIGNED_IN', session));
        return { data: { user, session }, error: null };
      }
      return { data: { user: null, session: null }, error: new Error('Email atau password salah.') };
    }),
    signUp: jest.fn(async ({ email, password }) => {
      if (mockUsers.has(email)) {
        return { data: { user: null }, error: new Error('Email sudah terdaftar.') };
      }
      const user = { id: `user-${Date.now()}`, email, password };
      mockUsers.set(email, user);
      currentAuthUser = user;
      const session = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        user,
      };
      mockAuthChangeListeners.forEach((cb) => cb('SIGNED_IN', session));
      return { data: { user, session }, error: null };
    }),
    signOut: jest.fn(async () => {
      currentAuthUser = null;
      mockAuthChangeListeners.forEach((cb) => cb('SIGNED_OUT', null));
      return { error: null };
    }),
    resetPasswordForEmail: jest.fn(async (email) => {
      if (email.includes('@')) return { error: null };
      return { error: new Error('Format email tidak valid.') };
    }),
    getSession: jest.fn(async () => {
      if (currentAuthUser) {
        return {
          data: {
            session: {
              access_token: 'mock-access-token',
              refresh_token: 'mock-refresh-token',
              expires_in: 3600,
              user: currentAuthUser,
            },
          },
          error: null,
        };
      }
      return { data: { session: null }, error: null };
    }),
    onAuthStateChange: jest.fn((callback) => {
      mockAuthChangeListeners.push(callback);
      if (currentAuthUser) {
        callback('SIGNED_IN', {
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token',
          expires_in: 3600,
          user: currentAuthUser,
        });
      }
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              const idx = mockAuthChangeListeners.indexOf(callback);
              if (idx !== -1) mockAuthChangeListeners.splice(idx, 1);
            },
          },
        },
      };
    }),
    setSession: jest.fn(async (session) => {
      if (session) {
        currentAuthUser = session.user || currentAuthUser;
      }
      return { data: { session }, error: null };
    }),
  },
  from: jest.fn((table) => {
    let list = db[table] || [];
    let queryResult = [...list];

    const chain: any = {
      select: jest.fn(() => chain),
      insert: jest.fn((payload) => {
        const items = Array.isArray(payload) ? payload : [payload];
        const inserted = items.map((item) => {
          const newItem = { 
            id: item.id || `id-${Date.now()}-${Math.random()}`, 
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...item 
          };
          list.push(newItem);
          return newItem;
        });
        
        queryResult = inserted;
        return chain;
      }),
      update: jest.fn((updates) => {
        queryResult.forEach((item) => {
          Object.assign(item, updates, { updated_at: new Date().toISOString() });
        });
        return chain;
      }),
      delete: jest.fn(() => {
        queryResult.forEach((item) => {
          const idx = list.indexOf(item);
          if (idx !== -1) list.splice(idx, 1);
        });
        queryResult = [];
        return chain;
      }),
      eq: jest.fn((field, val) => {
        queryResult = queryResult.filter((item) => item[field] === val);
        return chain;
      }),
      gte: jest.fn(() => chain),
      lte: jest.fn(() => chain),
      in: jest.fn((field, vals) => {
        queryResult = queryResult.filter((item) => vals.includes(item[field]));
        return chain;
      }),
      or: jest.fn(() => chain),
      order: jest.fn(() => chain),
      range: jest.fn(() => chain),
      limit: jest.fn((n) => {
        queryResult = queryResult.slice(0, n);
        return chain;
      }),
      single: jest.fn(async () => {
        if (queryResult.length === 0) {
          if (table === 'profiles') {
            return {
              data: {
                id: currentAuthUser?.id || 'demo-user-id',
                tenant_id: 'mock-tenant-id',
                full_name: currentAuthUser?.full_name || 'Demo Owner',
                role: 'owner',
                is_active: true,
              },
              error: null,
            };
          }
          if (table === 'tenants') return { data: db.tenants[0], error: null };
          if (table === 'outlets') return { data: db.outlets[0], error: null };
          return { data: null, error: { message: 'Row not found' } };
        }
        return { data: queryResult[0], error: null };
      }),
      then: (resolve: any) => {
        resolve({ data: queryResult, error: null });
      },
    };
    return chain;
  }),
};

// Pasang reset helper agar authService.__test__.reset di test suite berjalan
(mockSupabase as any).__test__ = {
  reset: async () => {
    currentAuthUser = null;
    mockUsers.clear();
    mockUsers.set('demo@kinclong.id', {
      id: 'demo-user-id',
      email: 'demo@kinclong.id',
      password: 'password123',
      full_name: 'Demo Owner',
    });
    mockAuthChangeListeners.length = 0;
    
    Object.keys(db).forEach(key => db[key] = []);
    seedDefaultData();
  },
};

// Bind reset helper ke authService.__test__.reset agar test suite berjalan lancar
const { authService } = require('./src/lib/authService');
if (authService?.__test__) {
  authService.__test__.reset = (mockSupabase as any).__test__.reset;
}

jest.mock('./src/lib/supabase', () => ({
  supabase: mockSupabase,
}));
