import { Navigate, Outlet, useNavigate } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { appAxios } from "../../utils/utils"
import { setUser } from "../../store/userSlice"

export default function AppLayout() {
  const user = useSelector((state) => state.user.info)

  const dispatch = useDispatch()
  const navigate = useNavigate()

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
