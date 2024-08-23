import type { PlasmoMessaging } from "@plasmohq/messaging"

import { WEB_VIEW_URL } from "~utils/envConfig"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  chrome.tabs.create({
    url: WEB_VIEW_URL
  })
}

export default handler
