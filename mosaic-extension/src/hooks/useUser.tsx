import type { User } from "@supabase/supabase-js"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

export const useUser = () => {
  const [user, setUser] = useStorage<User>(
    {
      key: "user",
      instance: new Storage({
        area: "local"
      })
    },
    (v) => (v === undefined ? null : v)
  )

  return { user, setUser }
}
