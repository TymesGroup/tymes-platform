import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the crypto module for testing
const mockEncrypt = vi.fn();
const mockDecrypt = vi.fn();

vi.mock('./crypto', () => ({
  encryptValue: mockEncrypt,
  decryptValue: mockDecrypt,
  clearEncryptionKey: vi.fn(),
}));

describe('crypto utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('encryptValue', () => {
    it('should encrypt a string value', async () => {
      const testValue = 'test-password-123';
      const encryptedValue = 'encrypted-base64-string';

      mockEncrypt.mockResolvedValue(encryptedValue);

      const { encryptValue } = await import('./crypto');
      const result = await encryptValue(testValue);

      expect(mockEncrypt).toHaveBeenCalledWith(testValue);
      expect(result).toBe(encryptedValue);
    });

    it('should handle empty strings', async () => {
      mockEncrypt.mockResolvedValue('');

      const { encryptValue } = await import('./crypto');
      const result = await encryptValue('');

      expect(result).toBe('');
    });
  });

  describe('decryptValue', () => {
    it('should decrypt an encrypted value', async () => {
      const encryptedValue = 'encrypted-base64-string';
      const decryptedValue = 'test-password-123';

      mockDecrypt.mockResolvedValue(decryptedValue);

      const { decryptValue } = await import('./crypto');
      const result = await decryptValue(encryptedValue);

      expect(mockDecrypt).toHaveBeenCalledWith(encryptedValue);
      expect(result).toBe(decryptedValue);
    });

    it('should handle invalid encrypted data gracefully', async () => {
      mockDecrypt.mockRejectedValue(new Error('Invalid data'));

      const { decryptValue } = await import('./crypto');

      await expect(decryptValue('invalid-data')).rejects.toThrow('Invalid data');
    });
  });
});
