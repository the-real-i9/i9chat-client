import { Check, CheckCheck } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  isOwn: boolean;
  timestamp: number;
  deliveryStatus: "pending" | "sent" | "delivered" | "read";
  senderName: string;
  senderAvatar: string;
  showAvatar: boolean;
  children: ReactNode;
}

export default function MessageWrapper(p: Props) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getReadReceipt = () => {
    if (!p.isOwn) return null;

    switch (p.deliveryStatus) {
      case "sent":
        return <Check size={14} className="text-gray-400" />;
      case "delivered":
        return <CheckCheck size={14} className="text-gray-400" />;
      case "read":
        return <CheckCheck size={14} className="text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex mb-4 ${p.isOwn ? "justify-end" : "justify-start"}`}>
      {!p.isOwn && p.showAvatar && (
        <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden mr-2 mt-auto">
          {p.senderAvatar ? (
            <img
              src={p.senderAvatar}
              alt={p.senderName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-xs font-medium">
              {p.senderName?.charAt(0)?.toUpperCase()}
            </div>
          )}
        </div>
      )}

      <div
        className={`max-w-xs lg:max-w-md ${p.isOwn ? "ml-auto" : "mr-auto"}`}
      >
        {!p.isOwn && !p.showAvatar && <div className="w-10" />}

        <div
          className={`rounded-lg p-3 ${
            p.isOwn
              ? "bg-blue-500 text-white"
              : "bg-white border border-gray-200"
          }`}
        >
          {!p.isOwn && p.senderName && (
            <div className="text-xs font-medium text-blue-600 mb-1">
              {p.senderName}
            </div>
          )}
          {p.children}
        </div>

        <div
          className={`flex items-center mt-1 space-x-1 ${p.isOwn ? "justify-end" : "justify-start"}`}
        >
          <span className="text-xs text-gray-500">
            {formatTime(p.timestamp)}
          </span>
          {getReadReceipt()}
        </div>
      </div>
    </div>
  );
}
