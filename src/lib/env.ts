/**
 * Environment Variables Validation
 *
 * Validates required environment variables at startup
 * Prevents runtime errors from missing configuration
 */

interface EnvConfig {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  GEMINI_API_KEY?: string;
}

interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  config: Partial<EnvConfig>;
}

/**
 * Get environment variable with fallback
 */
function getEnvVar(key: string): string | undefined {
  // Check import.meta.env (Vite)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const viteKey = `VITE_${key}`;
    if (import.meta.env[viteKey]) return import.meta.env[viteKey];
    if (import.meta.env[key]) return import.meta.env[key];
  }

  // Check process.env (Node/build time)
  if (typeof process !== 'undefined' && process.env) {
    if (process.env[key]) return process.env[key];
  }

  return undefined;
}

/**
 * Validate environment variables
 */
export function validateEnv(): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const config: Partial<EnvConfig> = {};

  // Required: Supabase URL
  const supabaseUrl = getEnvVar('SUPABASE_URL');
  if (!supabaseUrl) {
    errors.push('SUPABASE_URL is required');
  } else if (!supabaseUrl.startsWith('https://')) {
    errors.push('SUPABASE_URL must be a valid HTTPS URL');
  } else {
    config.SUPABASE_URL = supabaseUrl;
  }

  // Required: Supabase Anon Key
  const supabaseKey = getEnvVar('SUPABASE_ANON_KEY');
  if (!supabaseKey) {
    errors.push('SUPABASE_ANON_KEY is required');
  } else if (supabaseKey.length < 100) {
    warnings.push('SUPABASE_ANON_KEY seems too short - verify it is correct');
  } else {
    config.SUPABASE_ANON_KEY = supabaseKey;

    // Security check: ensure it's the anon key, not service role
    if (supabaseKey.includes('service_role')) {
      errors.push('SUPABASE_ANON_KEY appears to be a service role key - use anon key instead');
    }
  }

  // Optional: Gemini API Key
  const geminiKey = getEnvVar('GEMINI_API_KEY');
  if (geminiKey) {
    config.GEMINI_API_KEY = geminiKey;
  } else {
    warnings.push('GEMINI_API_KEY not set - AI features will be disabled');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    config,
  };
}

/**
 * Initialize and validate environment
 * Call this at app startup
 */
export function initializeEnv(): EnvConfig {
  const result = validateEnv();

  // Log warnings in development
  if (import.meta.env?.DEV) {
    result.warnings.forEach(warning => {
      console.warn(`[ENV] Warning: ${warning}`);
    });
  }

  // Throw on errors
  if (!result.isValid) {
    const errorMessage = `Environment validation failed:\n${result.errors.map(e => `  - ${e}`).join('\n')}`;

    if (import.meta.env?.DEV) {
      console.error(errorMessage);
      // In development, show a helpful message
      console.info('\nTo fix this, create a .env.local file with:\n');
      console.info('VITE_SUPABASE_URL=your-supabase-url');
      console.info('VITE_SUPABASE_ANON_KEY=your-anon-key');
      console.info('VITE_GEMINI_API_KEY=your-gemini-key (optional)\n');
    }

    throw new Error(errorMessage);
  }

  return result.config as EnvConfig;
}

/**
 * Get validated environment config
 * Cached after first call
 */
let cachedConfig: EnvConfig | null = null;

export function getEnvConfig(): EnvConfig {
  if (!cachedConfig) {
    cachedConfig = initializeEnv();
  }
  return cachedConfig;
}

export default getEnvConfig;
