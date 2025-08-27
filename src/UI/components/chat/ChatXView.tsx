import DMChatXView from "./DMChatXView";
import GroupChatXView from "./GroupChatXView";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

export default function ChatXView() {
  const chatIdent = useSelector(
    (state: RootState) => state.userChats.activeChatIdent,
  );

  const chatInfo = useSelector((state: RootState) =>
    state.userChats.value.find((uc) => uc.chat_ident === chatIdent),
  );

  return chatInfo ? (
    chatInfo.chat_type === "DM" ? (
      <DMChatXView chatInfo={chatInfo} />
    ) : (
      <GroupChatXView chatInfo={chatInfo} />
    )
  ) : null;
}
