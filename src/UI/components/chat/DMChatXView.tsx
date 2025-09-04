import { useEffect, useRef } from "react";
import { Phone, Video, MoreVertical } from "lucide-react";

import TextMessage from "./messageSnippets/TextMessage";
import PhotoMessage from "./messageSnippets/PhotoMessage";
/*import ReplyMessage from "./messageSnippets/ReplyMessage";
import VoiceMessage from "./messageSnippets/VoiceMessage";
import VideoMessage from "./messageSnippets/VideoMessage";
import AudioMessage from "./messageSnippets/AudioMessage";
import { FileMessage } from "./messageSnippets/FileMessage";*/
import type { ChatHistoryEntryT, UserChatT } from "../../../types/appTypes";
import { formatLastSeen } from "../../../utils/utils";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import MessageInput from "./MessageInput";

export default function DMChatXView({ chatInfo }: { chatInfo: UserChatT }) {
  const chatHistory = useSelector(
    (state: RootState) => state.userToChatHistoryMap.value[chatInfo.chat_ident],
  ) || [];

  const historyEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    historyEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  const renderChatHistoryEntry = (entry: ChatHistoryEntryT) => {
    const entryType = entry.chat_hist_entry_type;
    if (entryType !== "message" && entryType !== "reply") {
      return null;
    }

    const genProps = {
      isOwn: entry.is_own || false,
      timestamp: entry.created_at,
      deliveryStatus: entry.delivery_status || "pending",
      senderName: entry.sender?.username || "",
      senderAvatar: entry.sender?.profile_pic_url || "",
      showAvatar: true,
    };

    switch (entry.content?.type) {
      case "text":
        return (
          <TextMessage
            key={entry.id}
            textContent={entry.content.props.text_content || ""}
            {...genProps}
          />
        );
      case "photo":
        return (
          <PhotoMessage
            key={entry.id}
            content={{
              imageUrl: entry.content.props.url || "",
              caption: entry.content.props.caption || "",
            }}
            {...genProps}
          />
        );
      /*case "voice":
        return <VoiceMessage key={message.id} {...props} />;
      case "video":
        return <VideoMessage key={message.id} {...props} />;
      case "audio":
        return <AudioMessage key={message.id} {...props} />;
      case "file":
        return <FileMessage key={message.id} {...props} />;*/
      default:
        return null;
    }
  };

  return (
    <div className="chat-x-view h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Profile Picture */}
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
            {chatInfo.partner?.profile_pic_url ? (
              <img
                src={chatInfo.partner?.profile_pic_url}
                alt={chatInfo.partner?.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-medium">
                {chatInfo.partner?.username?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>

          {/* Name and Status */}
          <div>
            <h2 className="font-medium text-gray-900">
              {chatInfo.partner?.username}
            </h2>
            <div className="text-sm text-gray-500">
              <>
                {chatInfo.is_typing ? (
                  <span className="text-blue-600">
                    {chatInfo.partner?.username} is typing...
                  </span>
                ) : chatInfo.partner?.presence === "online" ? (
                  <span className="text-green-600">online</span>
                ) : (
                  formatLastSeen(chatInfo.partner?.last_seen || Date.now())
                )}
              </>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <Video size={20} />
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <Phone size={20} />
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#CBD5E0 #F7FAFC",
        }}
      >
        <style>{`
          .chat-x-view ::-webkit-scrollbar {
            width: 6px;
          }
          .chat-x-view ::-webkit-scrollbar-track {
            background: #f7fafc;
          }
          .chat-x-view ::-webkit-scrollbar-thumb {
            background: #cbd5e0;
            border-radius: 3px;
          }
          .chat-x-view ::-webkit-scrollbar-thumb:hover {
            background: #a0aec0;
          }
        `}</style>

        {chatHistory.map((entry) => renderChatHistoryEntry(entry))}
        <div ref={historyEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        chatType={chatInfo.chat_type}
        chatIdent={chatInfo.chat_ident}
      />
    </div>
  );
}
