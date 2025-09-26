import { useState } from "react";
import TextMessagingUI from "./messagingInterfaces/TextMsgInterface";

type Props = {
  chatType: "DM" | "group";
  chatIdent: string;
}

export default function MessagingInterface(p: Props) {
  const [msgIntf, setMsgIntf] = useState("text")
  
  const renderInterface = () => {
    switch (msgIntf) {
      case "text":
        return <TextMessagingUI chatType={p.chatType} chatIdent={p.chatIdent} />
    
      default:
        break;
    }
  }

  return (
    <div>MessagingInterface</div>
  )
}

