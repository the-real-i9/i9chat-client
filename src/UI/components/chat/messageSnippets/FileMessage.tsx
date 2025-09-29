import { useState } from "react"
import { Download, FileText } from "lucide-react"
import MessageSnippetWrapper from "../MessageSnippetWrapper"

// File Message
export function FileMessage({
  message,
  isOwn,
  timestamp,
  readStatus,
  senderName,
  senderAvatar,
  showAvatar,
}) {
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = () => {
    if (isDownloading) return
    setIsDownloading(true)
    // TODO: Implement actual file download
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
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
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isOwn ? "bg-white text-blue-500" : "bg-gray-100 text-gray-600"
          }`}
        >
          <FileText size={20} />
        </div>

        <div className="flex-1">
          <div
            className={`text-sm font-medium ${
              isOwn ? "text-white" : "text-gray-900"
            }`}
          >
            {message.fileName}
          </div>
          <div
            className={`text-xs ${isOwn ? "text-blue-100" : "text-gray-500"}`}
          >
            {formatFileSize(message.fileSize)}
          </div>

          {isDownloading && (
            <div
              className={`w-full bg-gray-200 rounded-full h-1 mt-1 ${
                isOwn ? "bg-blue-300" : ""
              }`}
            >
              <div
                className={`h-1 rounded-full ${
                  isOwn ? "bg-white" : "bg-blue-500"
                }`}
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
          )}
        </div>

        <button
          onClick={handleDownload}
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isOwn ? "bg-white text-blue-500" : "bg-blue-500 text-white"
          }`}
          disabled={isDownloading}
        >
          <Download size={16} />
        </button>
      </div>
    </MessageSnippetWrapper>
  )
}
