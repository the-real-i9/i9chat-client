import {
  Check,
  CheckCheck,
  Image,
  File,
  AudioLinesIcon,
  Video,
  Headphones,
} from "lucide-react"
import { formatTime } from "../../../utils/utils"
import { useDispatch, useSelector } from "react-redux"
import type { UserChatT } from "../../../types/appTypes"
import type { RootState } from "../../../store"
import { setActiveChat } from "../../../store/userChatsSlice"

export default function ChatSnippet({ userChat }: { userChat: UserChatT }) {
  const {
    chat_type: chatType,
    chat_ident: chatIdent,
    partner = null,
    group_info: groupInfo = null,
    unread_messages_count: unreadMessagesCount,
  } = userChat

  const isActive =
    useSelector(
      (state: RootState) => state.userChats.activeChat?.chat_ident
    ) === chatIdent

  const dispatch = useDispatch()

  const username = partner?.username,
    profilePicUrl = partner?.profile_pic_url

  const groupName = groupInfo?.name,
    pictureUrl = groupInfo?.picture_url

  const chatHistory = useSelector(
    (state: RootState) => state.chatIdentToHistoryMap.value[chatIdent]
  )

  // get lastChatHistoryEntry from state
  const lastChatHistoryEntry = chatHistory?.at(-1)

  const lchEntryType = lastChatHistoryEntry?.chat_hist_entry_type

  // get last message timestamp from state
  const lastMessageTimestamp = (() => {
    for (let i = chatHistory.length; i > 0; i--) {
      const histEntry = chatHistory[i - 1]

      if (histEntry.chat_hist_entry_type === "message") {
        return histEntry.created_at
      }
    }
  })()

  const renderLastChatEntry = () => {
    if (!lastChatHistoryEntry) return null

    const getMessageIcon = () => {
      if (lchEntryType !== "message") return null

      if (lastChatHistoryEntry.content?.type === "text") return null

      switch (lastChatHistoryEntry.content?.type) {
        case "voice":
          return <AudioLinesIcon size={14} className="text-gray-500" />
        case "audio":
          return <Headphones size={14} className="text-gray-500" />
        case "video":
          return <Video size={14} className="text-gray-500" />
        case "photo":
          return <Image size={14} className="text-gray-500" />
        case "file":
          return <File size={14} className="text-gray-500" />
        default:
          return null
      }
    }

    const getReadReceipt = () => {
      if (lchEntryType !== "message") return null

      if (!lastChatHistoryEntry.is_own)
        return `${lastChatHistoryEntry.sender?.username}:`

      switch (lastChatHistoryEntry.delivery_status) {
        case "sent":
          return <Check size={14} className="text-gray-400" />
        case "delivered":
          return <CheckCheck size={14} className="text-gray-400" />
        case "read":
          return <CheckCheck size={14} className="text-blue-500" />
        default:
          return null
      }
    }

    const getDisplayContent = () => {
      switch (lchEntryType) {
        case "reaction":
          return lastChatHistoryEntry.reaction
        case "group activity":
          return lastChatHistoryEntry.info
        default:
          switch (lastChatHistoryEntry.content?.type) {
            case "text":
              return lastChatHistoryEntry.content.props.text_content
            case "voice":
              return "Voice"
            case "photo":
              return lastChatHistoryEntry.content.props.caption || "Photo"
            case "video":
              return lastChatHistoryEntry.content.props.caption || "Video"
            case "audio":
              return "Audio"
            case "file":
              return lastChatHistoryEntry.content.props.name
            default:
              return null
          }
      }
    }

    return (
      <div className="flex items-center space-x-1 text-sm text-gray-600">
        {getReadReceipt()}
        {lchEntryType === "message" && !lastChatHistoryEntry.is_own && (
          <span>&nbsp;</span>
        )}
        {getMessageIcon()}
        <span className="truncate flex-1">{getDisplayContent()}</span>
      </div>
    )
  }

  return (
    <div
      className={`block p-3 hover:bg-gray-50 transition-colors cursor-pointer ${
        isActive ? "bg-blue-50 border-r-2 border-blue-500" : ""
      }`}
      onClick={() => dispatch(setActiveChat(userChat))}
    >
      <div className="flex items-center space-x-3">
        {/* Picture */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
            {chatType === "DM" ? (
              profilePicUrl ? (
                <img
                  src={profilePicUrl}
                  alt={username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-medium">
                  {username?.charAt(0)?.toUpperCase()}
                </div>
              )
            ) : pictureUrl ? (
              <img
                src={pictureUrl}
                alt={groupName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-medium">
                {groupName?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-gray-900 truncate">
              {partner?.username}
            </h3>
            {lastMessageTimestamp ? (
              <span className="text-xs text-gray-500">
                {formatTime(lastMessageTimestamp)}
              </span>
            ) : null}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">{renderLastChatEntry()}</div>

            {/* Unread Count */}
            {unreadMessagesCount > 0 && (
              <div className="ml-2 min-w-[20px] h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadMessagesCount > 99 ? "99+" : unreadMessagesCount}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
