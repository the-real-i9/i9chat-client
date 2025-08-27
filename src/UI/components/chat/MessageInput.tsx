import { useState, type FormEvent } from "react";
import { Send, Paperclip, Mic } from "lucide-react";

interface Props {
  chatType: "DM" | "group";
  chatIdent: string;
}

export default function MessageInput(p: Props) {
  const [messageInput, setMessageInput] = useState("");

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    // TODO: Send message to backend
    console.log("Sending message:", messageInput);
    setMessageInput("");
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
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
  );
}
