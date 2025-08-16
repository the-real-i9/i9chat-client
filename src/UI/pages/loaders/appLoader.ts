import { redirect } from "react-router";
import { appAxios } from "../../../utils/utils";

import store from "../../../store";
import { setUser } from "../../../store/userSlice";
import { setUserChats } from "../../../store/userChatsSlice";
import { setUserToChatHistoryMap } from "../../../store/userToChatHistoryMapSlice";
import type { ChatHistoryEntryT, UserChatT } from "../../../types/appTypes";

export default async function appLoader() {
  try {
    const { user } = store.getState();

    if (user.value) {
      return null;
    }

    /* --- USER DATA --- */
    const userResp = await appAxios.get("/app/user/session_user");
    if (!userResp.data) {
      return redirect("/signin");
    }
    store.dispatch(setUser(userResp.data));

    /* --- USER CHATS --- */
    // api request
    const userChatsResp = await appAxios.get("/app/user/my_chats");

    const userChats: UserChatT[] = userChatsResp.data;

    store.dispatch(setUserChats(userChats));

    /* --- CHATx HISTORY --- */

    const userChatHistory = new Map<string, ChatHistoryEntryT[]>();

    await Promise.all(
      userChats.map(async (uc) => {
        if (uc.chat_type === "DM") {
          const dmChatHistoryRes = await appAxios.get(
            `/app/dm_chat/${uc.partner?.username}/history`,
          );

          const dmChatHistory: ChatHistoryEntryT[] = dmChatHistoryRes.data;

          userChatHistory.set(uc.chat_ident, dmChatHistory);
        } else {
          const groupChatHistoryRes = await appAxios.get(
            `/app/group_chat/${uc.group_info?.id}/history`,
          );

          const groupChatHistory: ChatHistoryEntryT[] =
            groupChatHistoryRes.data;

          userChatHistory.set(uc.chat_ident, groupChatHistory);
        }
      }),
    );

    store.dispatch(
      setUserToChatHistoryMap(Object.fromEntries(userChatHistory)),
    );

    return null;
  } catch (error: any) {
    if (error.status == 401) return redirect("/signin");
    else console.error(error);
  }
}
