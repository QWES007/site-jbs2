import { createClient } from '@supabase/supabase-js';

// Récupération des variables d'environnement Vite / Vercel
const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ Supabase URL ou Clé Anon manquante dans les variables d'environnement.");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');