import { createClient } from "@supabase/supabase-js";

/** Cliente de navegador (clave anónima): solo lectura y suscripciones Realtime. */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
