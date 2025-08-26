import MessageWrapper from "./MessageWrapper";

interface Props {
  isOwn: boolean;
  timestamp: number;
  deliveryStatus: "pending" | "sent" | "delivered" | "read";
  senderName: string;
  senderAvatar: string;
  showAvatar: boolean;
  textContent: string;
}

export default function TextMessage(p: Props) {
  return (
    <MessageWrapper
      isOwn={p.isOwn}
      timestamp={p.timestamp}
      deliveryStatus={p.deliveryStatus}
      showAvatar={p.showAvatar}
      senderName={p.senderName}
      senderAvatar={p.senderAvatar}
    >
      <p className="text-sm">{p.textContent}</p>
    </MessageWrapper>
  );
}
