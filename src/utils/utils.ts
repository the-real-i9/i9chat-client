import axios from "axios";

export const appAxios = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

export const formatTime = (timestamp: number) => {
  const now = new Date();
  const messageTime = new Date(timestamp);
  const diffInMs = now.valueOf() - messageTime.valueOf();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInHours < 1) {
    // Less than an hour - show minutes
    const minutes = Math.floor(diffInMs / (1000 * 60));
    return minutes < 1 ? "now" : `${minutes}m`;
  } else if (diffInHours < 24) {
    // Less than a day - show hours
    return `${Math.floor(diffInHours)}h`;
  } else if (diffInDays < 7) {
    // Less than a week - show day name
    return messageTime.toLocaleDateString("en", { weekday: "short" });
  } else {
    // More than a week - show date
    return messageTime.toLocaleDateString("en", {
      month: "short",
      day: "numeric",
    });
  }
};

export const formatLastSeen = (lastSeen: number) => {
  const now = Date.now();
  const diffInMs = now - lastSeen;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInMinutes < 1) return "last seen just now";
  if (diffInMinutes < 60) return `last seen ${diffInMinutes}m ago`;
  if (diffInMinutes < 1440)
    return `last seen ${Math.floor(diffInMinutes / 60)}h ago`;
  return `last seen ${new Date(lastSeen).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}`;
};
