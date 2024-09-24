import type { User } from "@supabase/supabase-js"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

export const useFeatureToggle = () => {
  const [active, setActive] = useStorage<boolean>(
    {
      key: "feature-activation",

      instance: new Storage({
        area: "local"
      })
    },
    (v) => (v === undefined ? false : v)
  )

  const toggle = () => {
    setActive(!active)
  }

  return { active, toggle }
}
