import type { ReplyTargetMsgT } from "../../../../types/appTypes"
import MessageSnippetWrapper from "../MessageSnippetWrapper"

type Props = {
  isOwn: boolean
  timestamp: number
  deliveryStatus: "pending" | "sent" | "delivered" | "read"
  senderName: string
  senderAvatar: string
  showAvatar: boolean
  textContent: string
  replyTargetMsg: ReplyTargetMsgT | undefined
  activateReplyMode: () => void
}

export default function TextMessage(p: Props) {
  return (
    <MessageSnippetWrapper {...p}>
      {/* TODO: We should style this based on target message types. For now we'll just style for type "text" */}
      {p.replyTargetMsg && (
        <div
          className={`border-l-4 pl-3 mb-2 py-2 ${
            p.replyTargetMsg.is_own
              ? "border-white bg-blue-400"
              : "border-blue-500 bg-gray-50"
          }`}
        >
          <div
            className={`text-xs font-medium ${
              p.replyTargetMsg.is_own ? "text-blue-100" : "text-blue-600"
            }`}
          >
            {p.replyTargetMsg.sender_username}
          </div>
          <div
            className={`text-xs ${
              p.replyTargetMsg.is_own ? "text-blue-100" : "text-gray-600"
            }`}
          >
            {p.replyTargetMsg.content.props.text_content}
          </div>
        </div>
      )}
      <p className="text-sm">{p.textContent}</p>
    </MessageSnippetWrapper>
  )
}
