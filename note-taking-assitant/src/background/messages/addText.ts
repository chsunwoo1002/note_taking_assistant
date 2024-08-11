import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  fetch("http://localhost:3000/document/content", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ content: req.body.text })
  })
  console.log("addText message received", req.body)
}

export default handler
