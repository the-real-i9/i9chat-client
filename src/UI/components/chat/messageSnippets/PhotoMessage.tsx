import { useState } from "react";
import { Upload } from "lucide-react";
import MessageWrapper from "./MessageWrapper";

interface Props {
  isOwn: boolean;
  timestamp: number;
  deliveryStatus: "pending" | "sent" | "delivered" | "read";
  senderName: string;
  senderAvatar: string;
  showAvatar: boolean;
  uploadProgress?: number;
  content: {
    imageUrl: string;
    caption: string;
  };
}

export default function PhotoMessage(p: Props) {
  const [uploadProgress, setUploadProgress] = useState(p.uploadProgress || 100);

  return (
    <MessageWrapper
      isOwn={p.isOwn}
      timestamp={p.timestamp}
      deliveryStatus={p.deliveryStatus}
      showAvatar={p.showAvatar}
      senderName={p.senderName}
      senderAvatar={p.senderAvatar}
    >
      <div className="relative">
        <img
          src={p.content.imageUrl}
          alt="Shared photo"
          className="rounded-lg max-w-full h-auto"
          style={{ maxHeight: "300px" }}
        />

        {uploadProgress < 100 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
            <div className="text-white text-center">
              <Upload size={24} className="mx-auto mb-2" />
              <div className="text-sm">{uploadProgress}%</div>
            </div>
          </div>
        )}

        {p.content.caption && (
          <p className="text-sm mt-2">{p.content.caption}</p>
        )}
      </div>
    </MessageWrapper>
  );
}
