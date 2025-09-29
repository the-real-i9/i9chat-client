import { useState, type FormEvent } from "react"
import { Send, Paperclip, Mic, X } from "lucide-react"
import type { ReplyTargetMsgT, UserChatT } from "../../../../types/appTypes"
import RealtimeService from "../../../../services/realtimeService"
import { useDispatch, useSelector } from "react-redux"
import {
  appendChatHistoryEntry,
  updateNewlySentMsgEntryAfterServerReply,
} from "../../../../store/chatIdentToHistoryMapSlice"
import type { RootState } from "../../../../store"
import { addNewUserChat } from "../../../../store/userChatsSlice"

type Props = {
  chatInfo: UserChatT
  replyMode: { replyTargetMsg: ReplyTargetMsgT } | false
  deactivateReplyMode: () => void
  switchMsgInterface: (msgType: string) => void
}

export default function TextMessagingInterface(p: Props) {
  const [messageInput, setMessageInput] = useState("")

  const clientUser = useSelector((state: RootState) => state.user.value)

  const dispatch = useDispatch()

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim()) return

    // TODO: Send message to backend
    const now = Date.now()

    dispatch(
      appendChatHistoryEntry({
        chatIdent: p.chatInfo.chat_ident,
        chatType: p.chatInfo.chat_type,
        newHistoryEntry: {
          id: `temp_${Date.now()}`,
          chat_hist_entry_type: "message",
          created_at: now,
          delivery_status: "pending",
          sender: {
            username: clientUser?.username || "",
            profile_pic_url: clientUser?.profile_pic_url,
            presence: clientUser?.presence,
          },
          content: {
            type: "text",
            props: {
              text_content: messageInput,
            },
          },
          reply_target_msg: p.replyMode
            ? p.replyMode.replyTargetMsg
            : undefined,
          is_own: true,
        },
      })
    )

    const chatType = p.chatInfo.chat_type

    dispatch(
      addNewUserChat({
        chat_ident: p.chatInfo.chat_ident,
        chat_type: chatType,
        unread_messages_count: p.chatInfo.unread_messages_count,
        [chatType === "DM" ? "partner" : "group_info"]:
          chatType === "DM" ? p.chatInfo.partner : p.chatInfo.group_info,
      })
    )

    RealtimeService.send(
      {
        action:
          chatType === "DM"
            ? "send dm chat message"
            : "send group chat message",

        data: {
          [chatType === "DM" ? "partnerUsername" : "groupId"]:
            p.chatInfo.chat_ident,

          isReply: p.replyMode && true,
          replyTargetMsgId: p.replyMode
            ? p.replyMode.replyTargetMsg.id
            : undefined,

          msg: {
            type: "text",
            props: {
              text_content: messageInput,
            },
          },
          at: now,
        },
      },
      (data: any) => {
        dispatch(
          updateNewlySentMsgEntryAfterServerReply({
            chatIdent: p.chatInfo.chat_ident,
            chatType,
            newMsgId: data.new_msg_id,
          })
        )
      }
    )

    setMessageInput("")
    p.deactivateReplyMode()
  }

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      {/* TODO: We should style this based on target message types. For now we'll just style for type "text" */}
      {p.replyMode ? (
        <div className="bg-gray-200 py-3 px-4 mb-4 rounded-lg relative overflow-hidden">
          <div className="w-1 h-full bg-blue-500 absolute left-0 top-0" />
          <button
            className="absolute top-3 right-3"
            onClick={p.deactivateReplyMode}
          >
            <X size={24} className="text-gray-500" />
          </button>
          <div className="text-sm text-blue-600 mb-1">
            {p.replyMode.replyTargetMsg.is_own
              ? "You"
              : p.replyMode.replyTargetMsg.sender_username}
          </div>
          <div className="text-sm text-gray-600">
            {p.replyMode.replyTargetMsg.content.props.text_content}
          </div>
        </div>
      ) : null}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center space-x-3"
      >
        <button
          type="button"
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
        >
          <Paperclip size={20} />
        </button>

        <div className="flex-1 relative">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
          />

          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:bg-gray-100 rounded"
            onClick={() => p.switchMsgInterface("voice")}
          >
            <Mic size={18} />
          </button>
        </div>

        <button
          type="submit"
          disabled={!messageInput.trim()}
          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}
