import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Phone, Video, MoreVertical } from "lucide-react";

import TextMessage from "./messageSnippets/TextMessage";
import PhotoMessage from "./messageSnippets/PhotoMessage";
/*import ReplyMessage from "./messageSnippets/ReplyMessage";
import VoiceMessage from "./messageSnippets/VoiceMessage";
import VideoMessage from "./messageSnippets/VideoMessage";
import AudioMessage from "./messageSnippets/AudioMessage";
import { FileMessage } from "./messageSnippets/FileMessage";*/
import type { RootState } from "../../../store";
import type { ChatHistoryEntryT, UserChatT } from "../../../types/appTypes";
import MessageInput from "./MessageInput";

export default function GroupChatXView({ chatInfo }: { chatInfo: UserChatT }) {
  const chatHistory = useSelector(
    (state: RootState) => state.userToChatHistoryMap.value[chatInfo.chat_ident],
  ) || [];

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  const renderChatHistoryEntry = (entry: ChatHistoryEntryT) => {
    const entryType = entry.chat_hist_entry_type;
    if (
      entryType !== "message" &&
      entryType !== "reply" &&
      entryType !== "group activity"
    ) {
      return null;
    }

    if (entryType === "group activity") {
      return (
        <div
          key={entry.created_at}
          className="flex my-4 justify-center text-xs/[1.55]"
        >
          <p className="bg-gray-200 px-1.5 py-1 rounded-md max-w-sm text-center">
            {entry.info}
          </p>
        </div>
      );
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
            {chatInfo.group_info?.picture_url ? (
              <img
                src={chatInfo.group_info?.picture_url}
                alt={chatInfo.group_info?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-medium">
                {chatInfo.group_info?.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>

          {/* Name and Status */}
          <div>
            <h2 className="font-medium text-gray-900">
              {chatInfo.group_info?.name}
            </h2>
            <div className="text-sm text-gray-500">
              <>
                {chatInfo.group_info?.description && (
                  <div>{chatInfo.group_info?.description}</div>
                )}
                {chatInfo.typing_users && chatInfo.typing_users.length > 0 && (
                  <div className="text-blue-600">
                    {chatInfo.typing_users.length === 1
                      ? `${chatInfo.typing_users[0]} is typing...`
                      : chatInfo.typing_users.length === 2
                        ? `${chatInfo.typing_users.join(" and ")} are typing...`
                        : `${chatInfo.typing_users.length} people are typing...`}
                  </div>
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

        {chatHistory.map((entry: ChatHistoryEntryT) =>
          renderChatHistoryEntry(entry),
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        chatType={chatInfo.chat_type}
        chatIdent={chatInfo.chat_ident}
      />
    </div>
  );
}
