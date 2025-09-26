import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ChatHistoryEntryT } from "../types/appTypes"
import { update } from "idb-keyval"

type ChatIdentToHistoryMapState = {
  value: { [chatIdent: string]: ChatHistoryEntryT[] }
}

const initialState: ChatIdentToHistoryMapState = { value: {} }

const chatIdentToHistoryMapSlice = createSlice({
  name: "chatIdentToHistoryMap",
  initialState,
  reducers: {
    setChatIdentToHistoryMap: (
      state,
      action: PayloadAction<{ [chatIdent: string]: ChatHistoryEntryT[] }>
    ) => {
      state.value = action.payload
    },
    appendChatHistoryEntry: (
      state,
      action: PayloadAction<{
        chatIdent: string
        chatType: "DM" | "group"
        newHistoryEntry: ChatHistoryEntryT
      }>
    ) => {
      const { chatIdent, chatType, newHistoryEntry } = action.payload

      const chatHistory = state.value?.[chatIdent] || []

      chatHistory.push(newHistoryEntry)

      state.value[chatIdent] = chatHistory

      update<ChatHistoryEntryT[]>(
        `${chatType === "DM" ? "dm_chat" : "group_chat"}/${chatIdent}/history`,
        (ch) => {
          if (!ch) return []

          const chatHistory = ch

          chatHistory.push(newHistoryEntry)

          return chatHistory
        }
      )
    },
    updateNewlySentMsgEntryAfterServerReply: (
      state,
      action: PayloadAction<{
        chatIdent: string
        chatType: "DM" | "group"
        newMsgId: string
      }>
    ) => {
      const { chatIdent, chatType, newMsgId } = action.payload

      const chatHistory = state.value[chatIdent]

      chatHistory[chatHistory.length - 1].id = newMsgId
      chatHistory[chatHistory.length - 1].delivery_status = "sent"

      state.value[chatIdent] = chatHistory

      update<ChatHistoryEntryT[]>(
        `${chatType === "DM" ? "dm_chat" : "group_chat"}/${chatIdent}/history`,
        (ch) => {
          if (!ch) return []

          const chatHistory = ch

          chatHistory[chatHistory.length - 1].id = newMsgId
          chatHistory[chatHistory.length - 1].delivery_status = "sent"

          return chatHistory
        }
      )
    },
    updateMessageDeliveryStatus: (
      state,
      action: PayloadAction<{
        chatIdent: string
        chatType: "DM" | "group"
        msgId: string
        deliveryStatus: "delivered" | "read"
      }>
    ) => {
      const { chatIdent, chatType, msgId, deliveryStatus } = action.payload

      const chatHistory = state.value[chatIdent]

      for (let i = chatHistory.length; i > 0; i--) {
        const histEntry = chatHistory[i - 1]
        if (histEntry.id === msgId) {
          chatHistory[i - 1].delivery_status = deliveryStatus
          break
        }
      }

      state.value[chatIdent] = chatHistory

      update<ChatHistoryEntryT[]>(
        `${chatType === "DM" ? "dm_chat" : "group_chat"}/${chatIdent}/history`,
        (ch) => {
          if (!ch) return []

          const chatHistory = ch

          for (let i = chatHistory.length; i > 0; i--) {
            const histEntry = chatHistory[i - 1]
            if (histEntry.id === msgId) {
              chatHistory[i - 1].delivery_status = deliveryStatus
              break
            }
          }

          return chatHistory
        }
      )
    },
  },
})

export const {
  setChatIdentToHistoryMap,
  appendChatHistoryEntry,
  updateNewlySentMsgEntryAfterServerReply,
  updateMessageDeliveryStatus,
} = chatIdentToHistoryMapSlice.actions
export default chatIdentToHistoryMapSlice.reducer
