interface UserT {
  username: string
  email?: string
  profile_pic_url?: string
  presence?: "online" | "offline"
  last_seen?: number | null
}

interface GroupInfoT {
  id: string
  name: string
  description: string
  picture_url: string
}

interface UserChatT {
  chat_type: "DM" | "group"
  chat_ident: string
  unread_messages_count: number
  partner?: UserT
  group_info?: GroupInfoT
}

interface MessageContentT {
  type: "text" | "voice" | "audio" | "video" | "photo" | "file"
  props: {
    text_content?: string
    duration?: number
    caption?: string
    name?: string

    // you can access these from API responses,
    // but, don't send them in an API request
    size?: number
    url?: string
    mime_type?: string
    extension?: string
  }
}

interface ChatHistoryEntryT {
  chat_hist_entry_type: "message" | "reply" | "reaction" | "group activity"
  created_at: number

  id?: string
  content?: MessageContentT
  delivery_status?: "sent" | "delivered" | "read" | "pending"
  sender?: UserT
  reactions?: {
    reactor: UserT
    reaction: string
    at: number
  }[]

  replied_to?: {
    id: string
    content: MessageContentT
    sender_username: string
    is_own?: boolean
  }

  is_own?: boolean

  reaction?: string

  info?: string
}

export type { UserT, UserChatT, ChatHistoryEntryT, GroupInfoT }
