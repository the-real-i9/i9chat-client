import store from "../../store";
import { setUserPresence } from "../../store/userChatsSlice";

export default class IncomingWSMessageService {
  static foward(wsmsg: string) {
    const { event, data } = JSON.parse(wsmsg);

    switch (event) {
      case "user online":
        store.dispatch(
          setUserPresence({ username: data.user, presence: "online" }),
        );
        break;
      case "user offline":
        store.dispatch(
          setUserPresence({
            username: data.user,
            presence: "offline",
            last_seen: data.last_seen,
          }),
        );
        break;
      default:
        break;
    }
  }
}
