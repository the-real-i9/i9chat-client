import { useState } from "react";
import { Outlet } from "react-router";
import { Plus } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

import DMChatSnippet from "../components/chat/DMChatSnippet";
import GroupChatSnippet from "../components/chat/GroupChatSnippet";
import NewChatPane from "../components/chat/NewChatPane";

export default function ChatsTab() {
  const userChats = useSelector((state: RootState) => state.userChats.value);

  const [showNewChat, setShowNewChat] = useState(false);

  return (
    <div className="chats-tab h-full w-full flex relative">
      {/* Left Column - Chat List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col relative">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Chats</h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          {userChats.map((chat) =>
            chat.chat_type === "DM" ? (
              <DMChatSnippet key={chat.chat_ident} userChat={chat} />
            ) : (
              <GroupChatSnippet key={chat.chat_ident} userChat={chat} />
            ),
          )}
        </div>

        {/* Floating new chat button */}
        <button
          onClick={() => setShowNewChat(true)}
          className="absolute bottom-4 right-4 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
        >
          <Plus size={20} />
        </button>

        {showNewChat && <NewChatPane onClose={() => setShowNewChat(false)} />}
      </div>

      {/* Right Column */}
      <div className="flex-1 bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
}
