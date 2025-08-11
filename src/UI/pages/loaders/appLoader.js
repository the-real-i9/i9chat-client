import { redirect } from "react-router"
import store from "../../../store"
import { setUser } from "../../../store/userSlice"
import axios from "axios"

export default async function appLoader() {
  try {
    const resp = await axios.get(
      "http://localhost:8000/api/app/user/session_user",
      { withCredentials: true }
    )
    console.log(resp)

    const userInfo = {
      id: "1",
      username: "i9ine",
      profilePicUrl: "",
    }

    store.dispatch(setUser(userInfo))

    return null
  } catch (error) {
    if (error.status == 401) return redirect("/login")
    else console.error(error)
  }
}
