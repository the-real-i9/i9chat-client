import { redirect } from "react-router";
import { get, set } from "idb-keyval";

import { appAxios } from "../../../utils/utils";
import store from "../../../store";
import { setUser } from "../../../store/userSlice";
import { setUserChats } from "../../../store/userChatsSlice";
import { setUserToChatHistoryMap } from "../../../store/userToChatHistoryMapSlice";
import type { ChatHistoryEntryT, UserChatT } from "../../../types/appTypes";
import RealtimeService from "../../../services/realtimeService";

export default async function appLoader() {
  const sessionUser = await get("session_user");
  if (sessionUser) {
    store.dispatch(setUser(sessionUser));

    const userChats: UserChatT[] = (await get("my_chats")) || [];

    store.dispatch(setUserChats(userChats));

    const userChatHistory = new Map<string, ChatHistoryEntryT[]>();

    await Promise.all(
      [...userChats].map(async (uc) => {
        if (uc.chat_type === "DM") {
          const dmChatHistory: ChatHistoryEntryT[] =
            (await get(`dm_chat/${uc.partner?.username}/history`)) || [];

          userChatHistory.set(uc.chat_ident, dmChatHistory);
        } else {
          const groupChatHistory: ChatHistoryEntryT[] =
            (await get(`group_chat/${uc.group_info?.id}/history`)) || [];

          userChatHistory.set(uc.chat_ident, groupChatHistory);
        }
      }),
    );

    store.dispatch(
      setUserToChatHistoryMap(Object.fromEntries(userChatHistory)),
    );

    RealtimeService.init(new WebSocket("ws://localhost:8000/api/app/ws"));
  } else {
    /* Data couldn't be retrived from IndexedDB, request from the API server */
    try {
      /* --- USER DATA --- */
      const userResp = await appAxios.get("/app/user/session_user");
      if (!userResp.data) {
        return redirect("/signin");
      }

      set("session_user", userResp.data);
      store.dispatch(setUser(userResp.data));

      /* --- USER CHATS --- */
      // api request
      const userChatsResp = await appAxios.get("/app/user/my_chats");

      const userChats: UserChatT[] = userChatsResp.data;

      set("my_chats", userChats);
      store.dispatch(setUserChats(userChats));

      /* --- CHATx HISTORY --- */

      const userChatHistory = new Map<string, ChatHistoryEntryT[]>();

      await Promise.all(
        [...userChats].map(async (uc) => {
          if (uc.chat_type === "DM") {
            const dmChatHistoryRes = await appAxios.get(
              `/app/dm_chat/${uc.partner?.username}/history`,
            );

            const dmChatHistory: ChatHistoryEntryT[] = dmChatHistoryRes.data;

            set(`dm_chat/${uc.partner?.username}/history`, dmChatHistory);
            userChatHistory.set(uc.chat_ident, dmChatHistory);
          } else {
            const groupChatHistoryRes = await appAxios.get(
              `/app/group_chat/${uc.group_info?.id}/history`,
            );

            const groupChatHistory: ChatHistoryEntryT[] =
              groupChatHistoryRes.data;

            set(`group_chat/${uc.group_info?.id}/history`, groupChatHistory);
            userChatHistory.set(uc.chat_ident, groupChatHistory);
          }
        }),
      );

      store.dispatch(
        setUserToChatHistoryMap(Object.fromEntries(userChatHistory)),
      );

      RealtimeService.init(new WebSocket("ws://localhost:8000/api/app/ws"));

      return null;
    } catch (error: any) {
      if (error.status == 401) return redirect("/signin");
      else console.error(error);
    }

    RealtimeService.init(new WebSocket("ws://localhost:8000/api/app/ws"));
  }
}
