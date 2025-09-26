import axios from "axios"

export const appAxios = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
})

export const formatTime = (timestamp: number) => {
  const now = new Date()
  const messageTime = new Date(timestamp)
  const diffInMs = now.valueOf() - messageTime.valueOf()
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
    return messageTime.toLocaleDateString("en", { weekday: "short" })
  } else {
    // More than a week - show date
    return messageTime.toLocaleDateString("en", {
      month: "short",
      day: "numeric",
    })
  }
}

export const formatLastSeen = (lastSeen: number) => {
  const now = new Date()
  const seenDate = new Date(lastSeen)

  const isToday = now.toDateString() === seenDate.toDateString()

  const yesterday = new Date()
  yesterday.setDate(now.getDate() - 1)
  const isYesterday = yesterday.toDateString() === seenDate.toDateString()

  const timeString = seenDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  if (isToday) {
    return `last seen today at ${timeString}`
  } else if (isYesterday) {
    return `last seen yesterday at ${timeString}`
  } else if (now.getFullYear() === seenDate.getFullYear()) {
    return `last seen ${seenDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    })} at ${timeString}`
  } else {
    return `last seen ${seenDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })} at ${timeString}`
  }
}

export function getErrorMsg(errCode: string) {
  switch (errCode) {
    case "uERR_4000":
      return "account already exists"
    case "uERR_4001":
      return "incorrect code"
    case "uERR_4002":
      return "code expired! re-submit email"
    case "uERR_4003":
      return "username unavailable"
    case "uERR_4004":
      return "account doesn't exist"
    case "uERR_4005":
      return "incorrect token"
    case "uERR_4006":
      return "token expired! re-submit email"
    case "uERR_4007":
      return "incorrect credentials"
    case "uERR_4008":
      return "media upload timed out"
    default:
      return ""
  }
}
