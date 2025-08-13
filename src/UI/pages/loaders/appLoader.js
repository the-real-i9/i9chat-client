import { redirect } from "react-router"
import { appAxios } from "../../../utils/utils"

import store from "../../../store"
import { setUser } from "../../../store/userSlice"
import { setChats } from "../../../store/chatsSlice"

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
    // const userChatsResp = await appAxios.get("/app/user/my_chats")

    const sampleDMChat = {
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

    const sampleGroupChat = {
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

    store.dispatch(setChats(userChats))

    /* --- CHATx HISTORY --- */
    // iterate userChats, get fetch chat's history,
    // and restructure it into your state's format

    /** @type {Map<string, any[]>} */
    const userChatHistory = new Map()

    userChats.forEach(async (uc) => {
      if (uc.chat_type === "DM") {
        // make API request for DM chat history
        // sample DM chat history for user i9ine_prime
        const sampleDMChatHistory = [
          {
            chat_hist_entry_type: "message",
            created_at: new Date(2025, 8, 13, 7).valueOf(),
            id: "98ce3cd-56e7adec4a-23e23bb2-323e3fa",
            content: "json string format (:convert)",
            delivery_status: "read",
            is_own: true, // check if this user is the sender user
            sender: {
              username: "i9ine",
              profile_pic_url: "",
            },
          },
          {
            chat_hist_entry_type: "message",
            created_at: new Date(2025, 8, 13, 17).valueOf(),
            id: "98ce3cd-26e7addc4a-43e23bb2-623e3fa",
            content: "json string format (:convert)",
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
                reaction: {
                  reaction: "🙂",
                  created_at: new Date(2025, 8, 13, 17, 20).valueOf() 
                }
              }
            ]
          },
          {
            chat_hist_entry_type: "reaction",
            reaction: "🙂",
            created_at: new Date(2025, 8, 13, 17, 20).valueOf(),
          },
          {
            chat_hist_entry_type: "reply",
            created_at: new Date(2025, 8, 13, 19).valueOf(),
            id: "68ce3cd-26e7a4dc4a-43e24bb2-223e3fa",
            content: "json string format (:convert)",
            delivery_status: "delivered",
            is_own: true, // check if this user is the sender.username
            sender: {
              username: "i9ine",
              profile_pic_url: "",
            },
            replied_to: {
              id: "98ce3cd-26e7addc4a-43e23bb2-623e3fa",
              content: "json string format (:convert)",
              sender_username: "i9ine_prime",
              is_own: false, // check if this user is the sender_username
            },
          }
        ]

        userChatHistory.set(uc.chat_ident, sampleDMChatHistory)
      } else {
        // make API request for Group chat history
        // sample Group chat history for uc.chat_ident

        const sampleGroupChatHistory = []

        userChatHistory.set(uc.chat_ident, sampleGroupChatHistory)
      }
    })

    return null
  } catch (error) {
    if (error.status == 401) return redirect("/signin")
    else console.error(error)
  }
}
