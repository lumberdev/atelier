import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export const supabaseStorage = supabase.storage.from(
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_KEY
);
