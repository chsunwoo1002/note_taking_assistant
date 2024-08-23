import type { PlasmoMessaging } from "@plasmohq/messaging"

import { API_URL } from "~utils/envConfig"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("API_URL", API_URL)
  fetch(`${API_URL}/document/content`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ content: req.body.text })
  })
  console.log("addText message received", req.body)
}

export default handler
