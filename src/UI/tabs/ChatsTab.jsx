import { Outlet } from "react-router"
import ChatSnippet from "../components/ChatSnippet"

export default function ChatsTab() {
  // Mock data for testing - replace with real data from your backend
  const mockChats = [
    {
      chatId: "1",
      isGroup: false,
      profilePicUrl: null,
      name: "John Doe",
      unreadCount: 3,
      lastMessage: {
        type: "text",
        content: "Hey, how are you doing today?",
        isOwn: false,
        readStatus: null
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
    },
    {
      chatId: "2", 
      isGroup: true,
      profilePicUrl: null,
      name: "Work Team",
      unreadCount: 0,
      lastMessage: {
        type: "image",
        content: "",
        isOwn: true,
        readStatus: "read"
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
    }
  ]

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
          {mockChats.map((chat) => (
            <ChatSnippet
              key={chat.chatId}
              chatId={chat.chatId}
              isGroup={chat.isGroup}
              profilePicUrl={chat.profilePicUrl}
              name={chat.name}
              unreadCount={chat.unreadCount}
              lastMessage={chat.lastMessage}
              timestamp={chat.timestamp}
            />
          ))}
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