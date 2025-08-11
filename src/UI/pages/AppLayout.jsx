import { Navigate, Outlet } from "react-router"
import { useSelector } from "react-redux"

export default function AppLayout() {
  const user = useSelector((state) => state.user.info)

  return (
    <div className="app-layout h-screen flex">
      <div className="sidebar">
        <p>Your name is {user.username}</p>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
      <Navigate to="/chats" replace />
    </div>
  )
}
