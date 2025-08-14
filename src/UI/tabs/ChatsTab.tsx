import { Outlet } from "react-router"
import DMChatSnippet from "../components/DMChatSnippet"
import { useSelector } from "react-redux"
import GroupChatSnippet from "../components/GroupChatSnippet"
import type { RootState } from "../../store"

export default function ChatsTab() {
  const userChats = useSelector((state: RootState) => state.userChats.value)

  return (
    <div className="chats-tab h-full flex">
      {/* Left Column - Chat List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Chats</h1>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {userChats.map((chat) =>
            chat.chat_type === "DM" ? (
              <DMChatSnippet
                key={chat.chat_ident}
                chatIdent={chat.chat_ident}
                partner={chat.partner}
                unreadMessagesCount={chat.unread_messages_count}
              />
            ) : (
              <GroupChatSnippet
                key={chat.chat_ident}
                chatIdent={chat.chat_ident}
                groupInfo={chat.group_info}
                unreadMessagesCount={chat.unread_messages_count}
              />
            )
          )}
        </div>
      </div>

      {/* Right Column - Chat Content (Outlet for individual chats) */}
      <div className="flex-1 bg-gray-50">
        {/* This will be filled by ChatXView when a chat is selected */}
        <Outlet />
      </div>
    </div>
  )
}
