import { useState, type MouseEvent } from "react"
import { useNavigate } from "react-router"
import { useSelector, useDispatch } from "react-redux"
import {
  MessageCircle,
  Clock,
  Phone,
  Settings,
  LogOut,
  User,
} from "lucide-react"
import { clear } from "idb-keyval"

import { setUser } from "../../store/userSlice"
import { appAxios } from "../../utils/utils"

import type { RootState } from "../../store"
import { setActiveChat, setUserChats } from "../../store/userChatsSlice"
import { setChatIdentToHistoryMap } from "../../store/chatIdentToHistoryMapSlice"
import { setActiveTab } from "../../store/appTabsSlice"
import ChatsTab from "../tabs/ChatsTab"
import MomentsTab from "../tabs/MomentsTab"
import CallsTab from "../tabs/CallsTab"
import RealtimeService from "../../services/realtimeService"

export default function AppLayout() {
  const [showUserMenu, setShowUserMenu] = useState(false)

  const activeTab = useSelector((state: RootState) => state.appTabs.activeTab)

  const clientUser = useSelector((state: RootState) => state.user.value)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async (e: MouseEvent) => {
    e.preventDefault()

    setShowUserMenu(false)

    try {
      const resp = await appAxios.get("/app/user/signout")

      dispatch(setActiveTab("Chats"))
      dispatch(setUser(null))
      dispatch(setUserChats([]))
      dispatch(setActiveChat(null))
      dispatch(setChatIdentToHistoryMap({}))

      RealtimeService.terminate()

      await clear()

      navigate("/signin", { state: { msg: resp.data } })
    } catch (error) {
      console.error(error)
    }
  }

  const appTabs = [
    {
      name: "Chats",
      icon: MessageCircle,
    },
    {
      name: "Moments",
      icon: Clock,
    },
    {
      name: "Calls",
      icon: Phone,
    },
  ]

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Moments":
        return <MomentsTab />
      case "Calls":
        return <CallsTab />
      default:
        return <ChatsTab />
    }
  }

  return (
    <div className="app-layout h-screen flex">
      {/* Sidebar */}
      <div className="w-16 bg-gray-100 flex flex-col justify-between items-center py-4">
        {/* App Tabs */}
        <div className="flex flex-col space-y-4">
          {appTabs.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.name

            return (
              <button
                key={item.name}
                className={`p-3 rounded-lg transition-colors group relative ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => dispatch(setActiveTab(item.name))}
              >
                <Icon size={20} />
              </button>
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
            {clientUser?.profile_pic_url ? (
              <img
                src={clientUser.profile_pic_url}
                alt={clientUser.username}
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
                  <p className="font-medium text-gray-900">
                    {clientUser?.username}
                  </p>
                  <p className="text-sm text-gray-500">{clientUser?.email}</p>
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
      <div className="flex-1 flex">{renderActiveTab()}</div>
    </div>
  )
}
