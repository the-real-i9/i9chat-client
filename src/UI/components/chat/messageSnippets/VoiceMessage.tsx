import { useState } from "react"
import { Play, Pause, Mic } from "lucide-react"
import MessageSnippetWrapper from "../MessageSnippetWrapper"

export default function VoiceMessage({
  message,
  isOwn,
  timestamp,
  readStatus,
  senderName,
  senderAvatar,
  showAvatar,
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

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
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isOwn ? "bg-white text-blue-500" : "bg-blue-500 text-white"
          }`}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <div className="flex-1">
          <div className="flex items-center space-x-1 mb-1">
            <Mic size={14} className={isOwn ? "text-white" : "text-gray-500"} />
            {/* Audio waveform bars */}
            <div className="flex items-center space-x-0.5">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`w-0.5 rounded-full ${
                    i < (progress * 20) / 100
                      ? isOwn
                        ? "bg-white"
                        : "bg-blue-500"
                      : isOwn
                      ? "bg-blue-300"
                      : "bg-gray-300"
                  }`}
                  style={{ height: `${Math.random() * 16 + 4}px` }}
                />
              ))}
            </div>
          </div>

          <div
            className={`text-xs ${isOwn ? "text-blue-100" : "text-gray-500"}`}
          >
            {isPlaying
              ? `${Math.floor(currentTime / 60)}:${(currentTime % 60)
                  .toString()
                  .padStart(2, "0")}`
              : message.duration}
          </div>
        </div>
      </div>
    </MessageSnippetWrapper>
  )
}
