import { useState } from "react"
import { Play, Pause, Headphones } from "lucide-react"
import MessageSnippetWrapper from "../MessageSnippetWrapper"

export default function AudioMessage({
  message,
  isOwn,
  timestamp,
  readStatus,
  senderName,
  senderAvatar,
  showAvatar,
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [progress, setProgress] = useState(0)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    // TODO: Implement actual audio playback
  }

  return (
    <MessageSnippetWrapper
      isOwn={isOwn}
      timestamp={timestamp}
      readStatus={readStatus}
      showAvatar={showAvatar}
      senderName={senderName}
      senderAvatar={senderAvatar}
    >
      <div className="flex items-center space-x-3">
        <button
          onClick={togglePlay}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isOwn ? "bg-white text-blue-500" : "bg-blue-500 text-white"
          }`}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span
              className={`text-sm font-medium ${
                isOwn ? "text-white" : "text-gray-900"
              }`}
            >
              {message.fileName}
            </span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                isOwn ? "bg-white text-blue-500" : "bg-gray-100 text-gray-600"
              }`}
            >
              <Headphones size={12} />
            </div>
          </div>

          <div
            className={`w-full bg-gray-200 rounded-full h-1 ${
              isOwn ? "bg-blue-300" : ""
            }`}
          >
            <div
              className={`h-1 rounded-full ${
                isOwn ? "bg-white" : "bg-blue-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div
            className={`text-xs mt-1 ${
              isOwn ? "text-blue-100" : "text-gray-500"
            }`}
          >
            {isPlaying
              ? `${Math.floor(currentTime / 60)}:${(currentTime % 60)
                  .toString()
                  .padStart(2, "0")} / ${message.duration}`
              : message.duration}
          </div>
        </div>
      </div>
    </MessageSnippetWrapper>
  )
}
