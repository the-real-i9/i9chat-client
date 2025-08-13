import axios from "axios";

export const appAxios = axios.create({ baseURL: "http://localhost:8000/api", withCredentials: true })

export const formatTime = (timestamp) => {
    const now = new Date()
    const messageTime = new Date(timestamp)
    const diffInMs = now - messageTime
    const diffInHours = diffInMs / (1000 * 60 * 60)
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

    if (diffInHours < 1) {
      // Less than an hour - show minutes
      const minutes = Math.floor(diffInMs / (1000 * 60))
      return minutes < 1 ? "now" : `${minutes}m`
    } else if (diffInHours < 24) {
      // Less than a day - show hours
      return `${Math.floor(diffInHours)}h`
    } else if (diffInDays < 7) {
      // Less than a week - show day name
      return messageTime.toLocaleDateString('en', { weekday: 'short' })
    } else {
      // More than a week - show date
      return messageTime.toLocaleDateString('en', { month: 'short', day: 'numeric' })
    }
  }
