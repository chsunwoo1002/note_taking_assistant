import { supabase } from "@/core/supabase"

export const signOut = () => {
  supabase.auth.signOut()
}
