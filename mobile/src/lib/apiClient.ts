/**
 * lib/apiClient.ts — (DEPRECATED)
 *
 * Aplikasi sekarang menggunakan Client-to-Supabase langsung.
 * File ini dipertahankan hanya agar build tooling lama tidak error.
 */

export const api = {
  get:    async <T>(path: string): Promise<T> => { throw new Error(`Deprecated: Gunakan Supabase secara langsung daripada memanggil ${path}`); },
  post:   async <T>(path: string, _body: unknown): Promise<T> => { throw new Error(`Deprecated: Gunakan Supabase secara langsung daripada memanggil ${path}`); },
  patch:  async <T>(path: string, _body: unknown): Promise<T> => { throw new Error(`Deprecated: Gunakan Supabase secara langsung daripada memanggil ${path}`); },
  put:    async <T>(path: string, _body: unknown): Promise<T> => { throw new Error(`Deprecated: Gunakan Supabase secara langsung daripada memanggil ${path}`); },
  delete: async <T>(path: string): Promise<T> => { throw new Error(`Deprecated: Gunakan Supabase secara langsung daripada memanggil ${path}`); },
};

export class KinclongApiError extends Error {
  code:   string;
  status: number;
  constructor(message: string, code: string, status: number) {
    super(message);
    this.code   = code;
    this.status = status;
  }
}

export async function loadTokensFromStorage(): Promise<void> {}
export async function saveTokens(_accessToken: string, _refreshToken: string): Promise<void> {}
export async function clearTokens(): Promise<void> {}
export function setTokens(_access: string, _refresh: string): void {}
