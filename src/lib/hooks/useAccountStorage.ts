/**
 * useAccountStorage Hook
 *
 * Manages saved accounts and encrypted credentials
 * Handles multi-account functionality
 */

import { useCallback } from 'react';
import { encryptValue, decryptValue, clearEncryptionKey } from '../crypto';

const ACCOUNTS_KEY = 'tymes_saved_accounts';
const CREDENTIALS_KEY = 'tymes_saved_credentials';

export interface StoredAccount {
  id: string;
  email: string;
  name: string;
  type: string;
  avatar_url: string | null;
}

interface Credentials {
  email: string;
  password: string;
}

/**
 * Load accounts from localStorage
 */
export function loadAccounts(): StoredAccount[] {
  try {
    const data = localStorage.getItem(ACCOUNTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Save accounts to localStorage
 */
export function saveAccounts(accounts: StoredAccount[]): void {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

/**
 * Save encrypted credentials
 */
export async function saveCredentials(id: string, email: string, password: string): Promise<void> {
  try {
    const data = localStorage.getItem(CREDENTIALS_KEY);
    const creds = data ? JSON.parse(data) : {};
    const encryptedPwd = await encryptValue(password);
    creds[id] = { email, pwd: encryptedPwd };
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
  } catch {
    // Silent fail - credentials won't be saved but app continues
  }
}

/**
 * Get decrypted credentials
 */
export async function getCredentials(id: string): Promise<Credentials | null> {
  try {
    const data = localStorage.getItem(CREDENTIALS_KEY);
    if (!data) return null;
    const creds = JSON.parse(data);
    if (!creds[id]) return null;
    const password = await decryptValue(creds[id].pwd);
    return { email: creds[id].email, password };
  } catch {
    return null;
  }
}

/**
 * Remove credentials for an account
 */
export function removeCredentials(id: string): void {
  try {
    const data = localStorage.getItem(CREDENTIALS_KEY);
    if (!data) return;
    const creds = JSON.parse(data);
    delete creds[id];
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
  } catch {
    // Silent fail
  }
}

/**
 * Clear all stored data
 */
export function clearAllStoredData(): void {
  localStorage.removeItem(ACCOUNTS_KEY);
  localStorage.removeItem(CREDENTIALS_KEY);
  localStorage.removeItem('tymes_last_activity');
  localStorage.removeItem('tymes_user_preferences');
  localStorage.removeItem('tymes_analytics');

  // Clear encryption key
  clearEncryptionKey();

  // Clear Supabase items
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('sb-') || key.startsWith('tymes-')) {
      localStorage.removeItem(key);
    }
  });

  // Clear cookies
  const cookiesToClear = [
    'tymes-auth-token',
    'tymes_last_activity',
    'tymes_user_preferences',
    'tymes_session_id',
  ];

  cookiesToClear.forEach(name => {
    document.cookie = `${name}=; path=/; max-age=0;`;
  });

  // Clear sessionStorage
  sessionStorage.clear();
}

/**
 * Hook for account storage operations
 */
export function useAccountStorage() {
  const load = useCallback(loadAccounts, []);
  const save = useCallback(saveAccounts, []);

  const saveCreds = useCallback(saveCredentials, []);
  const getCreds = useCallback(getCredentials, []);
  const removeCreds = useCallback(removeCredentials, []);

  const clearAll = useCallback(clearAllStoredData, []);

  const updateAccount = useCallback((account: StoredAccount) => {
    const accounts = loadAccounts();
    const idx = accounts.findIndex(a => a.id === account.id);

    if (idx >= 0) {
      accounts[idx] = account;
    } else {
      accounts.push(account);
    }

    saveAccounts(accounts);
    return accounts;
  }, []);

  const removeAccount = useCallback((accountId: string) => {
    const accounts = loadAccounts().filter(a => a.id !== accountId);
    saveAccounts(accounts);
    removeCredentials(accountId);
    return accounts;
  }, []);

  return {
    loadAccounts: load,
    saveAccounts: save,
    saveCredentials: saveCreds,
    getCredentials: getCreds,
    removeCredentials: removeCreds,
    updateAccount,
    removeAccount,
    clearAll,
  };
}

export default useAccountStorage;
