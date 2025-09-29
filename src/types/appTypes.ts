type UserT = {
  username: string
  email?: string
  profile_pic_url?: string
  bio?: string
  presence?: "online" | "offline"
  last_seen?: number
}

type GroupInfoT = {
  id: string
  name: string
  description: string
  picture_url: string
}

type UserChatT = {
  chat_type: "DM" | "group"
  is_typing?: boolean
  typing_users?: string[]
  chat_ident: string
  unread_messages_count: number
  partner?: UserT
  group_info?: GroupInfoT
}

type MessageContentT = {
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

type ReplyTargetMsgT = {
  id: string
  content: MessageContentT
  sender_username: string
  is_own: boolean
}

type ChatHistoryEntryT = {
  chat_hist_entry_type: "message" | "reaction" | "group activity"
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

  reply_target_msg?: ReplyTargetMsgT

  is_own: boolean

  reaction?: string

  info?: string
}

export type { UserT, UserChatT, ChatHistoryEntryT, GroupInfoT, ReplyTargetMsgT }
