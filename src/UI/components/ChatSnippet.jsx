import { Link } from "react-router"
import {
  Check,
  CheckCheck,
  Image,
  File,
  Mic,
  Heart,
  Users,
  UserPlus,
} from "lucide-react"
import { formatTime } from "../../utils/utils"

export default function ChatSnippet({
  chatIdent,
  chatType,
  chatPic,
  chatName,
  unreadMessagesCount = 0,
  lastMessage /* remove */,
  timestamp /* remove */,
  isActive = false,
}) {
  // get lastChatHistoryEntry from state
  const lastChatHistoryEntry = null

  // get last message timestamp from state
  const lastMessageTimestamp = null

  const renderMessageContent = () => {
    if (!lastMessage) return null

    const { type, content, isOwn, readStatus } = lastMessage

    const getMessageIcon = () => {
      switch (type) {
        case "image":
          return <Image size={14} className="text-gray-500" />
        case "file":
          return <File size={14} className="text-gray-500" />
        case "voice":
          return <Mic size={14} className="text-gray-500" />
        case "reaction":
          return <Heart size={14} className="text-red-500" />
        case "group_activity":
          return isGroup ? (
            <Users size={14} className="text-blue-500" />
          ) : (
            <UserPlus size={14} className="text-blue-500" />
          )
        default:
          return null
      }
    }

    const getReadReceipt = () => {
      if (!isOwn) return null

      switch (readStatus) {
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
      switch (type) {
        case "image":
          return "Photo"
        case "file":
          return "File"
        case "voice":
          return "Voice message"
        case "reaction":
          return `Reacted ${content} to a message`
        case "group_activity":
          return content // e.g., "John joined the group"
        default:
          return content
      }
    }

    return (
      <div className="flex items-center space-x-1 text-sm text-gray-600">
        {getMessageIcon()}
        <span className="truncate flex-1">{getDisplayContent()}</span>
        {getReadReceipt()}
      </div>
    )
  }

  return (
    <Link
      to={`/chats/${chatId}`}
      className={`block p-3 hover:bg-gray-50 transition-colors ${
        isActive ? "bg-blue-50 border-r-2 border-blue-500" : ""
      }`}
    >
      <div className="flex items-center space-x-3">
        {/* Profile Picture */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
            {profilePicUrl ? (
              <img
                src={profilePicUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-medium">
                {name?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>

          {/* Group indicator */}
          {isGroup && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
              <Users size={10} className="text-white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-gray-900 truncate">{name}</h3>
            <span className="text-xs text-gray-500">
              {formatTime(timestamp)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">{renderMessageContent()}</div>

            {/* Unread Count */}
            {unreadCount > 0 && (
              <div className="ml-2 min-w-[20px] h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 99 ? "99+" : unreadCount}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
