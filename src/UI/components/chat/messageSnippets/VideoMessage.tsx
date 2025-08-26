import { useState } from "react";
import { Play, Upload } from "lucide-react";
import MessageWrapper from "./MessageWrapper";

export default function VideoMessage({
  message,
  isOwn,
  timestamp,
  readStatus,
  senderName,
  senderAvatar,
  showAvatar,
}) {
  const [uploadProgress, setUploadProgress] = useState(
    message.uploadProgress || 100,
  );

  return (
    <MessageWrapper
      isOwn={isOwn}
      timestamp={timestamp}
      readStatus={readStatus}
      showAvatar={showAvatar}
      senderName={senderName}
      senderAvatar={senderAvatar}
    >
      <div className="relative">
        <img
          src={message.thumbnailUrl}
          alt="Video thumbnail"
          className="rounded-lg max-w-full h-auto"
          style={{ maxHeight: "300px" }}
        />

        {uploadProgress === 100 && (
          <button className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <Play size={24} className="text-white ml-1" />
            </div>
          </button>
        )}

        {uploadProgress < 100 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
            <div className="text-white text-center">
              <Upload size={24} className="mx-auto mb-2" />
              <div className="text-sm">{uploadProgress}%</div>
            </div>
          </div>
        )}

        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          {message.duration}
        </div>

        {message.caption && <p className="text-sm mt-2">{message.caption}</p>}
      </div>
    </MessageWrapper>
  );
}
