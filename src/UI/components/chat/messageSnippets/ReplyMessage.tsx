import MessageSnippetWrapper from "../MessageSnippetWrapper"

export default function ReplyMessage({
  message,
  isOwn,
  timestamp,
  readStatus,
  senderName,
  senderAvatar,
  showAvatar,
}) {
  return (
    <MessageSnippetWrapper
      isOwn={isOwn}
      timestamp={timestamp}
      readStatus={readStatus}
      showAvatar={showAvatar}
      senderName={senderName}
      senderAvatar={senderAvatar}
    >
      <div
        className={`border-l-4 pl-3 mb-2 py-2 ${
          isOwn ? "border-white bg-blue-400" : "border-blue-500 bg-gray-50"
        }`}
      >
        <div
          className={`text-xs font-medium ${
            isOwn ? "text-blue-100" : "text-blue-600"
          }`}
        >
          {message.replyTo.senderName}
        </div>
        <div className={`text-xs ${isOwn ? "text-blue-100" : "text-gray-600"}`}>
          {message.replyTo.content}
        </div>
      </div>
      <p className="text-sm">{message.content}</p>
    </MessageSnippetWrapper>
  )
}
