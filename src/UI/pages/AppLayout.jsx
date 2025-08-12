import { Navigate, Outlet, useNavigate } from "react-router"
import { useDispatch, useSelector } from "react-redux"

import { appAxios } from "../../utils/utils"
import { setUser } from "../../store/userSlice"
import { useEffect } from "react"
import OutgoingWSMessageService from "../../services/realtimeServices/OutgoingWSMsgService"
import IncomingWSMessageService from "../../services/realtimeServices/IncomingWSMsgService"

export default function AppLayout() {
  const user = useSelector((state) => state.user.info)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  /* ------------ */
  
  useEffect(() => {

    const ws = new WebSocket("ws://localhost:8000/api/app/ws")

    const onOpen = () => console.log("WebSocket connected")
    const onError = () => console.log("WebSocket error")
    const onClose = (ev) =>
      console.log(
        "WebSocket closed. Code: %d. Reason: %s. Normal closure: %s",
        ev.code,
        ev.reason,
        ev.wasClean
      )

    OutgoingWSMessageService.init(ws)

    const onMessage = (ev) => {
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

  /**
   * @param {Event} e
   */
  const handleLogout = async (e) => {
    e.preventDefault()

    try {
      const resp = await appAxios.get("/app/user/signout")

      dispatch(setUser(null))

      navigate("/signin", { state: { msg: resp.data } })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="app-layout h-screen flex">
      <div className="sidebar">
        <p>Your name is {user?.username}</p>
        <button
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
      <Navigate to="/chats" replace />
    </div>
  )
}
