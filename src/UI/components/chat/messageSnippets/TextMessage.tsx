import MessageSnippetWrapper from "../MessageSnippetWrapper"

type Props = {
  isOwn: boolean
  timestamp: number
  deliveryStatus: "pending" | "sent" | "delivered" | "read"
  senderName: string
  senderAvatar: string
  showAvatar: boolean
  textContent: string
}

export default function TextMessage(p: Props) {
  return (
    <MessageSnippetWrapper {...p}>
      <p className="text-sm">{p.textContent}</p>
    </MessageSnippetWrapper>
  )
}
