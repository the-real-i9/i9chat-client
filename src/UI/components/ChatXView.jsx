import { useLoaderData } from "react-router"

export default function ChatXView() {

  const data = useLoaderData()

  return (
    <div className="chat-x-view h-full flex items-center justify-center text-gray-500">
      Chatting with {data.chatIdent}
    </div>
  )
}
