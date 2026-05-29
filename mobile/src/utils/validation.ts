/**
 * utils/validation.ts — Fungsi validasi form untuk auth flow Kinclong
 *
 * Semua fungsi murni (pure) — tidak bergantung pada React atau store.
 * Mudah di-test secara unit dan dapat dipakai di screen manapun.
 *
 * Pola:
 * - Fungsi individual mengembalikan `string | null` (pesan error atau null jika valid)
 * - Fungsi form-level mengembalikan objek errors (kosong jika valid semua)
 * - `hasErrors()` untuk cek cepat apakah ada error
 */

// ─── Regex ────────────────────────────────────────────────────────────────────
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// ─── Field validators ─────────────────────────────────────────────────────────

/** Validasi format email */
export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return 'Email wajib diisi';
  if (!EMAIL_REGEX.test(trimmed)) return 'Format email tidak valid (contoh: nama@email.com)';
  return null;
}

/** Validasi kekuatan kata sandi */
export function validatePassword(password: string, minLength = 8): string | null {
  if (!password) return 'Kata sandi wajib diisi';
  if (password.length < minLength) return `Kata sandi minimal ${minLength} karakter`;
  return null;
}

/** Validasi field yang wajib diisi */
export function validateRequired(value: string, label: string): string | null {
  if (!value.trim()) return `${label} wajib diisi`;
  return null;
}

/** Validasi kecocokan dua kata sandi */
export function validatePasswordConfirm(password: string, confirm: string): string | null {
  if (!confirm) return 'Konfirmasi kata sandi wajib diisi';
  if (password !== confirm) return 'Kata sandi tidak cocok';
  return null;
}

// ─── Form validators ──────────────────────────────────────────────────────────

export type LoginFormErrors = Partial<Record<'email' | 'password', string>>;

/**
 * Validasi form login
 * @returns Objek kosong {} jika semua valid
 */
export function validateLoginForm(email: string, password: string): LoginFormErrors {
  const errors: LoginFormErrors = {};
  const emailErr    = validateEmail(email);
  const passwordErr = validatePassword(password);
  if (emailErr)    errors.email    = emailErr;
  if (passwordErr) errors.password = passwordErr;
  return errors;
}

// ─────────────────────────────────────────────────────────────────────────────

export type RegisterFormFields = {
  carwashName:     string;
  fullName:        string;
  email:           string;
  password:        string;
  confirmPassword: string;
};

export type RegisterFormErrors = Partial<Record<keyof RegisterFormFields, string>>;

/**
 * Validasi form registrasi
 * @returns Objek kosong {} jika semua valid
 */
export function validateRegisterForm(form: RegisterFormFields): RegisterFormErrors {
  const errors: RegisterFormErrors = {};

  const carwashErr  = validateRequired(form.carwashName, 'Nama car wash');
  const fullNameErr = validateRequired(form.fullName, 'Nama lengkap');
  const emailErr    = validateEmail(form.email);
  const passwordErr = validatePassword(form.password);
  const confirmErr  = validatePasswordConfirm(form.password, form.confirmPassword);

  if (carwashErr)  errors.carwashName     = carwashErr;
  if (fullNameErr) errors.fullName        = fullNameErr;
  if (emailErr)    errors.email           = emailErr;
  if (passwordErr) errors.password        = passwordErr;
  if (confirmErr)  errors.confirmPassword = confirmErr;

  return errors;
}

/**
 * Helper: apakah ada minimal satu error?
 * @example
 * const errors = validateLoginForm(email, password);
 * if (hasErrors(errors)) return; // jangan submit
 */
export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some(Boolean);
}
