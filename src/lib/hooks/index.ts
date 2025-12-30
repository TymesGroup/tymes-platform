/**
 * Custom Hooks - Central Export
 */

export { useReducedMotion } from './useReducedMotion';
export {
  useSessionActivity,
  updateLastActivity,
  getLastActivity,
  clearActivityData,
} from './useSessionActivity';
export {
  useAccountStorage,
  loadAccounts,
  saveAccounts,
  saveCredentials,
  getCredentials,
  removeCredentials,
  clearAllStoredData,
} from './useAccountStorage';
export type { StoredAccount } from './useAccountStorage';
