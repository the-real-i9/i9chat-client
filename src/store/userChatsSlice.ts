import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { UserChatT } from "../types/appTypes"
import { update } from "idb-keyval"

type UserChatsStateT = {
  value: UserChatT[]
  activeChat: UserChatT | null
}

const initialState: UserChatsStateT = { value: [], activeChat: null }

const userChatsSlice = createSlice({
  name: "userChats",
  initialState,
  reducers: {
    setUserChats: (state, action: PayloadAction<UserChatT[]>) => {
      state.value = action.payload
    },
    setActiveChat: (state, action: PayloadAction<UserChatT | null>) => {
      state.activeChat = action.payload
    },
    addNewUserChat: (state, action: PayloadAction<UserChatT>) => {
      const newUserChat = action.payload

      const userChats = state.value

      if (
        userChats.findIndex((uc) => uc.chat_ident === newUserChat.chat_ident) >
        -1
      ) {
        return
      }

      userChats.unshift(action.payload)

      state.value = userChats

      update<UserChatT[]>("my_chats", (ucs) => {
        if (!ucs) return []

        const userChats = ucs

        userChats.unshift(action.payload)

        return userChats
      })
    },
    setUserPresence: (state, action) => {
      const { username, presence, last_seen = undefined } = action.payload

      const userChats = state.value

      const indexOfUser = userChats.findIndex(
        (uc) => uc.partner?.username === username
      )

      if (indexOfUser < 0) return

      if (userChats[indexOfUser].partner) {
        userChats[indexOfUser].partner.presence = presence
        userChats[indexOfUser].partner.last_seen = last_seen
      }

      state.value = userChats

      // update clientDB
      update<UserChatT[]>("my_chats", (ucs) => {
        if (!ucs) return []

        const userChats = ucs

        const indexOfUser = userChats.findIndex(
          (uc) => uc.partner?.username === username
        )

        if (indexOfUser < 0) return userChats

        if (userChats[indexOfUser].partner) {
          userChats[indexOfUser].partner.presence = presence
          userChats[indexOfUser].partner.last_seen = last_seen
        }

        return userChats
      })

      // -----------------

      const activeChat = state.activeChat

      if (activeChat?.partner && activeChat.partner.username === username) {
        activeChat.partner.presence = presence
        activeChat.partner.last_seen = last_seen
      }

      state.activeChat = activeChat
    },
    updateUnreadMessagesCount: (
      state,
      action: PayloadAction<{ chatIdent: string; byVal: 1 | -1 }>
    ) => {
      const { chatIdent, byVal } = action.payload

      const userChats = state.value

      const indexOfUser = userChats.findIndex(
        (uc) => uc.chat_ident === chatIdent
      )

      if (indexOfUser < 0) return

      userChats[indexOfUser].unread_messages_count += byVal

      state.value = userChats

      // update clientDB
      update<UserChatT[]>("my_chats", (ucs) => {
        if (!ucs) return []

        const userChats = ucs

        const indexOfUser = userChats.findIndex(
          (uc) => uc.chat_ident === chatIdent
        )

        if (indexOfUser < 0) return userChats

        userChats[indexOfUser].unread_messages_count += byVal

        return userChats
      })
    },
  },
})

export const {
  setUserChats,
  setActiveChat,
  addNewUserChat,
  setUserPresence,
  updateUnreadMessagesCount,
} = userChatsSlice.actions
export default userChatsSlice.reducer
