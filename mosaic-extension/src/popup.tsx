import type { User } from "@supabase/supabase-js"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

export default function IndexPopup() {
  const [user, setUser] = useStorage<User>({
    key: "user",
    instance: new Storage({
      area: "local"
    })
  })
  return <div>Hello World {user?.email}</div>
}
