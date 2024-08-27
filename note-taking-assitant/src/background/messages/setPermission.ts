import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const storage = new Storage({ area: "local" })
  await storage.set("permission", req.body.permission)

  const permission = await storage.get("permission")
  res.send({ permission })
}

export default handler
