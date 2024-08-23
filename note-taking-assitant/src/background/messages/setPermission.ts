import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("req", req.body.permission)
  const storage = new Storage({ area: "local" })
  await storage.set("permission", req.body.permission)
  const permission = await storage.get("permission")
  console.log("permission from storage", permission)
  res.send({ permission: req.body.permission })
}

export default handler
