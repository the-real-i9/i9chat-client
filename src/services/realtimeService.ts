import store from "../store"
import {
  appendChatHistoryEntry,
  updateMessageDeliveryStatus,
} from "../store/chatIdentToHistoryMapSlice"
import { setUserPresence } from "../store/userChatsSlice"

const onOpen = () => console.log("WebSocket connected")
const onError = () => console.log("WebSocket error")
const onClose = (ev: CloseEvent) =>
  console.log(
    "WebSocket closed. Code: %d. Reason: %s. Normal closure: %s",
    ev.code,
    ev.reason,
    ev.wasClean
  )

const onMessage = (ev: MessageEvent) => {
  RealtimeService.receive(ev.data)
}

export default class RealtimeService {
  static ws: WebSocket | null = null
  static serverReplyCallback: { [toAction: string]: (data: any) => void } = {}

  static init(ws: WebSocket) {
    ws.addEventListener("open", onOpen)
    ws.addEventListener("error", onError)
    ws.addEventListener("close", onClose)
    ws.addEventListener("message", onMessage)

    RealtimeService.ws = ws
  }

  static send(
    message: { action: string; data: any },
    serverReplyCallback: (data: any) => void
  ) {
    RealtimeService.ws?.send(JSON.stringify(message))

    RealtimeService.serverReplyCallback[message.action] = serverReplyCallback
  }

  static receive(wsmsg: string) {
    const { event, toAction = null, data } = JSON.parse(wsmsg)

    switch (event) {
      case "user online":
        store.dispatch(
          setUserPresence({ username: data.user, presence: "online" })
        )
        break
      case "user offline":
        store.dispatch(
          setUserPresence({
            username: data.user,
            presence: "offline",
            last_seen: data.last_seen,
          })
        )
        break
      case "new dm chat message":
        store.dispatch(
          appendChatHistoryEntry({
            chatIdent: data.sender.username,
            chatType: "DM",
            newHistoryEntry: data,
          })
        )

        RealtimeService.send(
          {
            action: "ack dm chat message delivered",
            data: {
              partnerUsername: data.sender.username,
              msgId: data.id,
              at: Date.now(),
            },
          },
          () => {}
        )
        break
      case "dm chat message delivered":
        store.dispatch(
          updateMessageDeliveryStatus({
            chatIdent: data.partner_username,
            chatType: "DM",
            msgId: data.msg_id,
            deliveryStatus: "delivered",
          })
        )
        break
      case "dm chat message read":
        store.dispatch(
          updateMessageDeliveryStatus({
            chatIdent: data.partner_username,
            chatType: "DM",
            msgId: data.msg_id,
            deliveryStatus: "read",
          })
        )
        break
      case "server reply":
        RealtimeService.serverReplyCallback[toAction]?.(data)
        break
      default:
        break
    }
  }

  static terminate() {
    const ws = RealtimeService.ws

    if (!ws) return

    ws.close(1000)

    ws.removeEventListener("open", onOpen)
    ws.removeEventListener("error", onError)
    ws.removeEventListener("close", onClose)
    ws.removeEventListener("message", onMessage)
  }
}
