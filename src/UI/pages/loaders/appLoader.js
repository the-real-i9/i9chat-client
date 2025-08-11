import { redirect } from "react-router"
import store from "../../../store"
import { setUser } from "../../../store/userSlice"
import { appAxios } from "../../../utils/utils"

export default async function appLoader() {
  try {
    const { user } = store.getState()

    if (user.info) {
      return null
    }

    const resp = await appAxios.get("/app/user/session_user")
    console.log(resp)

    const userInfo = {
      id: "1",
      username: "i9ine",
      profilePicUrl: "",
    }

    store.dispatch(setUser(userInfo))

    return null
  } catch (error) {
    if (error.status == 401) return redirect("/signin")
    else console.error(error)
  }
}
