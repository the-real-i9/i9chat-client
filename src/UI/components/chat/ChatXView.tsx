import DMChatXView from "./DMChatXView";
import GroupChatXView from "./GroupChatXView";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

export default function ChatXView() {
  const chatInfo = useSelector(
    (state: RootState) => state.userChats.activeChat,
  ); 

  return chatInfo ? (
    chatInfo.chat_type === "DM" ? (
      <DMChatXView chatInfo={chatInfo} />
    ) : (
      <GroupChatXView chatInfo={chatInfo} />
    )
  ) : null;
}
