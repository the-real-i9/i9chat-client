import { redirect } from "react-router";
import store from "../../../store";
import { setUser } from "../../../store/userSlice";

export default async function appLoader() {

  // simulate API request
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const userInfo = {
    id: "1",
    username: "i9ine",
    profilePicUrl: "",

  }

  store.dispatch(setUser(userInfo))

  return redirect("/login")
}