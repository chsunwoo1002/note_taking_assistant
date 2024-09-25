import type { User } from "@supabase/supabase-js"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

export const useSelectedNoteId = () => {
  const [selectedNoteId, setSelectedNoteId] = useStorage<string>(
    {
      key: "selectedNote",
      instance: new Storage({
        area: "local"
      })
    },
    (v) => (v === undefined ? null : v)
  )

  return { selectedNoteId, setSelectedNoteId }
}
