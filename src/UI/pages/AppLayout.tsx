import { useState, useEffect, type MouseEvent } from "react"
import { Navigate, Outlet, Link, useLocation, useNavigate } from "react-router"
import { useSelector, useDispatch } from "react-redux"
import { MessageCircle, Clock, Phone, Users, Settings, LogOut, User } from "lucide-react"

import { setUser } from "../../store/userSlice"
import { appAxios } from "../../utils/utils"
import OutgoingWSMessageService from "../../services/realtimeServices/OutgoingWSMsgService"
import IncomingWSMessageService from "../../services/realtimeServices/IncomingWSMsgService"

import type { RootState } from "../../store"

export default function AppLayout() {
  const [showUserMenu, setShowUserMenu] = useState(false)

  const user = useSelector((state: RootState) => state.user.value)

  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  /* WebSocket Setup */
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/api/app/ws")

    const onOpen = () => console.log("WebSocket connected")
    const onError = () => console.log("WebSocket error")
    const onClose = (ev: CloseEvent) =>
      console.log(
        "WebSocket closed. Code: %d. Reason: %s. Normal closure: %s",
        ev.code,
        ev.reason,
        ev.wasClean
      )

    OutgoingWSMessageService.init(ws)

    const onMessage = (ev: MessageEvent) => {
      IncomingWSMessageService.foward(ev.data)
    }

    ws.addEventListener("open", onOpen)
    ws.addEventListener("error", onError)
    ws.addEventListener("close", onClose)
    ws.addEventListener("message", onMessage)

    return () => {
      ws.close(1000)

      ws.removeEventListener("open", onOpen)
      ws.removeEventListener("error", onError)
      ws.removeEventListener("close", onClose)
      ws.removeEventListener("message", onMessage)
    }
  }, [])

  const handleLogout = async (e: MouseEvent) => {
    e.preventDefault()

    setShowUserMenu(false)

    try {
      const resp = await appAxios.get("/app/user/signout")

      dispatch(setUser(null))

      navigate("/signin", { state: { msg: resp.data } })
    } catch (error) {
      console.error(error)
    }
  }

  const navigationItems = [
    {
      name: "Chats",
      path: "/chats",
      icon: MessageCircle,
    },
    {
      name: "Moments",
      path: "/moments",
      icon: Clock,
    },
    {
      name: "Calls",
      path: "/calls",
      icon: Phone,
    },
    {
      name: "Friends",
      path: "/friends",
      icon: Users,
    },
  ]

  const isActivePath = (path: string) => {
    return location.pathname.startsWith(path)
  }

  return (
    <div className="app-layout h-screen flex">
      {/* Sidebar */}
      <div className="w-16 bg-gray-100 flex flex-col justify-between items-center py-4">
        {/* Navigation Items */}
        <div className="flex flex-col space-y-4">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = isActivePath(item.path)
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`p-3 rounded-lg transition-colors group relative ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                title={item.name}
              >
                <Icon size={20} />
                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {item.name}
                </div>
              </Link>
            )
          })}
        </div>

        {/* User Profile Section */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
            title="Account"
          >
            {user?.profile_pic_url ? (
              <img
                src={user.profile_pic_url}
                alt={user.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User size={20} />
            )}
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              
              {/* Menu */}
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <div className="p-3 border-b border-gray-200">
                  <p className="font-medium text-gray-900">{user?.username}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                
                <div className="py-1">
                  <button
                    onClick={() => setShowUserMenu(false)}
                    className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        <Outlet />
      </div>
      
      {/* Default redirect to chats */}
      {location.pathname === "/" && <Navigate to="/chats" replace />}
    </div>
  )
}