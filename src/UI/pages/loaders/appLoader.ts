import { redirect } from "react-router"
import { appAxios } from "../../../utils/utils"

import store from "../../../store"
import { setUser } from "../../../store/userSlice"
import { setUserChats } from "../../../store/userChatsSlice"
import { setUserToChatHistoryMap } from "../../../store/userToChatHistoryMapSlice"
import type { ChatHistoryEntryT, UserChatT } from "../../../types/appTypes"

export default async function appLoader() {
  try {
    const { user } = store.getState()

    if (user.value) {
      return null
    }

    /* --- USER DATA --- */
    const userResp = await appAxios.get("/app/user/session_user")
    if (!userResp.data) {
      return redirect("/signin")
    }
    store.dispatch(setUser(userResp.data))

    /* --- USER CHATS --- */
    // api request
    const userChatsResp = await appAxios.get("/app/user/my_chats")

    const sampleDMChat: UserChatT = {
      chat_type: "DM",
      chat_ident: "i9ine_prime",
      partner: {
        username: "i9ine_prime",
        profile_pic_url: "",
        presence: "online",
        last_seen: Date.now(),
      },
      unread_messages_count: 3,
    }

    const sampleGroupChat: UserChatT = {
      chat_type: "group",
      chat_ident: "24cc3fd-32e3adec4d-23e23bb2-32323fa", // UUIDv4
      group_info: {
        name: "Our Hood",
        picture_url: "",
        description: "This is how we do it",
      },
      unread_messages_count: 0,
    }

    const userChats = [sampleDMChat, sampleGroupChat]

    store.dispatch(setUserChats(userChats))

    /* --- CHATx HISTORY --- */
    // iterate userChats, get fetch chat's history,
    // and restructure it into your state's format

    const userChatHistory: Record<string, ChatHistoryEntryT[]> = {}

    userChats.forEach(async (uc) => {
      if (uc.chat_type === "DM") {
        // make API request for DM chat history
        // sample DM chat history for user i9ine_prime
        const sampleDMChatHistory: ChatHistoryEntryT[] = [
          {
            chat_hist_entry_type: "message",
            created_at: new Date(2025, 7, 13, 7).valueOf(),
            id: "98ce3cd-56e7adec4a-23e23bb2-323e3fa",
            // content will come from API as json, transform it into object
            content: {
              type: "text",
              props: {
                text_content: "Hi, there",
              },
            },
            delivery_status: "read",
            is_own: true, // check if this user is the sender user
            sender: {
              username: "i9ine",
              profile_pic_url: "",
            },
          },
          {
            chat_hist_entry_type: "message",
            created_at: new Date(2025, 7, 13, 17).valueOf(),
            id: "98ce3cd-26e7addc4a-43e23bb2-623e3fa",
            // content will come from API as json, transform it into object
            content: {
              type: "text",
              props: {
                text_content: "Hi, there",
              },
            },
            delivery_status: "sent",
            is_own: false, // check if this user is the sender.username
            sender: {
              username: "i9ine_prime",
              profile_pic_url: "",
            },
            reactions: [
              {
                reactor: {
                  username: "i9ine_prime",
                  profile_pic_url: "",
                },
                reaction: "🙂",
                at: new Date(2025, 7, 13, 17, 20).valueOf(),
              },
            ],
          },
          {
            chat_hist_entry_type: "reaction",
            reaction: "🙂",
            created_at: new Date(2025, 7, 13, 17, 20).valueOf(),
          },
          {
            chat_hist_entry_type: "reply",
            created_at: new Date(2025, 7, 13, 19).valueOf(),
            id: "68ce3cd-26e7a4dc4a-43e24bb2-223e3fa",
            // content will come from API as json, transform it into object
            content: {
              type: "text",
              props: {
                text_content: "How's it going?",
              },
            },
            delivery_status: "read",
            is_own: true, // check if this user is the sender.username
            sender: {
              username: "i9ine",
              profile_pic_url: "",
            },
            replied_to: {
              id: "98ce3cd-26e7addc4a-43e23bb2-623e3fa",
              // content will come from API as json, transform it into object
              content: {
                type: "text",
                props: {
                  text_content: "Hi, there",
                },
              },
              sender_username: "i9ine_prime",
              is_own: false, // check if this user is the sender_username
            },
          },
        ]

        userChatHistory[uc.chat_ident] = sampleDMChatHistory
      } else {
        // make API request for Group chat history
        // sample Group chat history for uc.chat_ident

        const sampleGroupChatHistory: ChatHistoryEntryT[] = [
          {
            chat_hist_entry_type: "group activity",
            created_at: new Date(2025, 7, 14, 10).valueOf(),
            info: "You created this group",
          },
          {
            chat_hist_entry_type: "group activity",
            created_at: new Date(2025, 7, 14, 12).valueOf(),
            info: "You added i9ine_prime",
          },
          {
            chat_hist_entry_type: "message",
            created_at: new Date(2025, 7, 14, 11).valueOf(),
            id: "98ce3cd-26e7addc4a-43e23bb2-623e3fa",
            // content will come from API as json, transform it into object
            content: {
              type: "text",
              props: {
                text_content: "Who add me?",
              },
            },
            delivery_status: "delivered",
            is_own: false, // check if this user is the sender.username
            sender: {
              username: "i9ine_prime",
              profile_pic_url: "",
            },
          },
          
        ]

        userChatHistory[uc.chat_ident] = sampleGroupChatHistory
      }
    })

    store.dispatch(setUserToChatHistoryMap(userChatHistory))

    return null
  } catch (error: any) {
    if (error.status == 401) return redirect("/signin")
    else console.error(error)
  }
}
