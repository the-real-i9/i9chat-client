import { useState } from "react"
import TextMessagingInterface from "./messagingInterfaces/TextMessagingInterface"
import type { RepliedMsgT, UserChatT } from "../../../types/appTypes"

type Props = {
  chatInfo: UserChatT
  replyMode: { repMsg: RepliedMsgT } | false
}

export default function MessagingInterface(p: Props) {
  const [msgType, setMsgType] = useState("text")

  const switchMsgInterface = (msgType: string) => {
    setMsgType(msgType)
  }

  const renderMsgInterface = () => {
    switch (msgType) {
      case "voice":
      case "photo":
      case "video":
      case "file":
      default:
        return (
          <TextMessagingInterface
            switchMsgInterface={switchMsgInterface}
            {...p}
          />
        )
    }
  }

  return renderMsgInterface()
}
