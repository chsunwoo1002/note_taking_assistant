import type { PlasmoMessaging } from "@plasmohq/messaging"

import { WEB_VIEW_URL } from "~utils/envConfig"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  chrome.tabs.create({ url: req.body.url }, (tab) => {
    if (chrome.runtime.lastError) {
      console.error("Error creating tab:", chrome.runtime.lastError)
      res.send({ success: false, error: chrome.runtime.lastError.message })
    } else {
      console.log("Tab created successfully:", tab.id)
      res.send({ success: true, tabId: tab.id })
    }
  })
}

export default handler
