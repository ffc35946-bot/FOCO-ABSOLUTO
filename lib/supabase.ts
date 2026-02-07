
import { createClient } from '@supabase/supabase-js';

/**
 * Safely retrieves environment variables from common locations.
 * In Vite, variables are usually in import.meta.env.
 * In Vercel or Node-like environments, they are in process.env.
 */
const getEnv = (key: string): string => {
  try {
    // Attempt to access Vite's import.meta.env
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      const val = (import.meta as any).env[key];
      if (val) return val;
    }
  } catch (e) {
    // Fall through
  }

  try {
    // Attempt to access process.env (Node.js/Vercel/Browser polyfills)
    if (typeof process !== 'undefined' && process.env) {
      const val = (process.env as any)[key];
      if (val) return val;
    }
  } catch (e) {
    // Fall through
  }

  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

/**
 * The Supabase SDK throws "supabaseUrl is required" if initialized with an empty string.
 * We use placeholder values if the real credentials are not yet configured.
 * This allows the app to boot and render, showing a clear warning instead of a blank screen crash.
 */
const effectiveUrl = supabaseUrl && supabaseUrl.trim() !== '' 
  ? (supabaseUrl.startsWith('http') ? supabaseUrl : `https://${supabaseUrl}`)
  : 'https://placeholder-project.supabase.co';

const effectiveKey = supabaseAnonKey && supabaseAnonKey.trim() !== '' 
  ? supabaseAnonKey 
  : 'placeholder-anon-key';

export const supabase = createClient(effectiveUrl, effectiveKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase configuration missing. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY " +
    "are set in your environment variables (e.g., in Vercel or a .env file)."
  );
}
