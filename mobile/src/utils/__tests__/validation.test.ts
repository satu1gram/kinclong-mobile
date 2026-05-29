import {
  validateEmail,
  validatePassword,
  validateRequired,
  validatePasswordConfirm,
  validateLoginForm,
  validateRegisterForm,
  hasErrors,
} from '../../utils/validation';

/**
 * Unit tests untuk semua fungsi validasi auth
 * Fungsi murni (pure) — tidak butuh mock apapun
 */

// ─── validateEmail ────────────────────────────────────────────────────────────
describe('validateEmail', () => {
  it('returns null for valid email', () => {
    expect(validateEmail('user@email.com')).toBeNull();
    expect(validateEmail('user.name+tag@domain.co.id')).toBeNull();
    expect(validateEmail('  user@email.com  ')).toBeNull(); // trim
  });

  it('returns error for empty email', () => {
    expect(validateEmail('')).toBe('Email wajib diisi');
    expect(validateEmail('   ')).toBe('Email wajib diisi');
  });

  it('returns error for invalid email format', () => {
    expect(validateEmail('notanemail')).toContain('tidak valid');
    expect(validateEmail('missing@')).toContain('tidak valid');
    expect(validateEmail('@nodomain.com')).toContain('tidak valid');
  });
});

// ─── validatePassword ─────────────────────────────────────────────────────────
describe('validatePassword', () => {
  it('returns null for valid password', () => {
    expect(validatePassword('password123')).toBeNull();
    expect(validatePassword('12345678')).toBeNull(); // exactly 8 chars
  });

  it('returns error for empty password', () => {
    expect(validatePassword('')).toBe('Kata sandi wajib diisi');
  });

  it('returns error when too short', () => {
    expect(validatePassword('1234567')).toContain('minimal 8 karakter');
  });

  it('respects custom minLength', () => {
    expect(validatePassword('abc', 6)).toContain('minimal 6 karakter');
    expect(validatePassword('abcdef', 6)).toBeNull();
  });
});

// ─── validateRequired ─────────────────────────────────────────────────────────
describe('validateRequired', () => {
  it('returns null for non-empty string', () => {
    expect(validateRequired('Kinclong', 'Nama')).toBeNull();
  });

  it('returns error for empty string', () => {
    expect(validateRequired('', 'Nama car wash')).toBe('Nama car wash wajib diisi');
    expect(validateRequired('   ', 'Nama')).toBe('Nama wajib diisi');
  });
});

// ─── validatePasswordConfirm ──────────────────────────────────────────────────
describe('validatePasswordConfirm', () => {
  it('returns null when passwords match', () => {
    expect(validatePasswordConfirm('pass123', 'pass123')).toBeNull();
  });

  it('returns error when confirm is empty', () => {
    expect(validatePasswordConfirm('pass123', '')).toContain('wajib diisi');
  });

  it('returns error when passwords do not match', () => {
    expect(validatePasswordConfirm('pass123', 'different')).toBe('Kata sandi tidak cocok');
  });
});

// ─── validateLoginForm ────────────────────────────────────────────────────────
describe('validateLoginForm', () => {
  it('returns empty object for valid input', () => {
    const errors = validateLoginForm('user@email.com', 'password123');
    expect(errors).toEqual({});
  });

  it('returns both errors when both fields invalid', () => {
    const errors = validateLoginForm('', '');
    expect(errors.email).toBeDefined();
    expect(errors.password).toBeDefined();
  });

  it('returns only email error', () => {
    const errors = validateLoginForm('invalid-email', 'password123');
    expect(errors.email).toBeDefined();
    expect(errors.password).toBeUndefined();
  });
});

// ─── validateRegisterForm ─────────────────────────────────────────────────────
describe('validateRegisterForm', () => {
  const valid = {
    carwashName:     'Kinclong Car Wash',
    fullName:        'Budi Santoso',
    email:           'budi@email.com',
    password:        'password123',
    confirmPassword: 'password123',
  };

  it('returns empty object for valid form', () => {
    expect(validateRegisterForm(valid)).toEqual({});
  });

  it('returns errors for empty form', () => {
    const errors = validateRegisterForm({
      carwashName: '', fullName: '', email: '',
      password: '', confirmPassword: '',
    });
    expect(Object.keys(errors).length).toBeGreaterThan(0);
  });

  it('returns confirmPassword error when passwords do not match', () => {
    const errors = validateRegisterForm({ ...valid, confirmPassword: 'mismatch' });
    expect(errors.confirmPassword).toBeDefined();
  });

  it('returns no error if all valid', () => {
    const errors = validateRegisterForm(valid);
    expect(hasErrors(errors)).toBe(false);
  });
});

// ─── hasErrors ────────────────────────────────────────────────────────────────
describe('hasErrors', () => {
  it('returns false for empty object', () => {
    expect(hasErrors({})).toBe(false);
  });

  it('returns false when all values are undefined', () => {
    expect(hasErrors({ email: undefined, password: undefined })).toBe(false);
  });

  it('returns true when any value is a string', () => {
    expect(hasErrors({ email: 'Email wajib diisi' })).toBe(true);
  });
});
