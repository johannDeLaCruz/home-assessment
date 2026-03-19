import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidPassword, sanitize } from './validation';

describe('validation', () => {
  describe('isValidEmail', () => {
    it('accepts valid emails', () => {
      expect(isValidEmail('a@b.co')).toBe(true);
      expect(isValidEmail('user@example.com')).toBe(true);
    });
    it('rejects invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@nodomain')).toBe(false);
      expect(isValidEmail('noatsign.com')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('accepts 8+ chars', () => {
      expect(isValidPassword('12345678')).toBe(true);
      expect(isValidPassword('longpassword')).toBe(true);
    });
    it('rejects short passwords', () => {
      expect(isValidPassword('short')).toBe(false);
      expect(isValidPassword('')).toBe(false);
    });
  });

  describe('sanitize', () => {
    it('trims and truncates', () => {
      expect(sanitize('  ab  ')).toBe('ab');
      expect(sanitize('a'.repeat(2000)).length).toBe(1000);
    });
  });
});
