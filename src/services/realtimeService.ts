
import store from "../store";
import { setUserPresence } from "../store/userChatsSlice";

const onOpen = () => console.log("WebSocket connected");
const onError = () => console.log("WebSocket error");
const onClose = (ev: CloseEvent) =>
  console.log(
    "WebSocket closed. Code: %d. Reason: %s. Normal closure: %s",
    ev.code,
    ev.reason,
    ev.wasClean,
  );

const onMessage = (ev: MessageEvent) => {
  RealtimeService.receive(ev.data);
};

export default class RealtimeService {
  static ws: WebSocket | null = null;

  static init(ws: WebSocket) {
    ws.addEventListener("open", onOpen);
    ws.addEventListener("error", onError);
    ws.addEventListener("close", onClose);
    ws.addEventListener("message", onMessage);
 
    RealtimeService.ws = ws
  }

  static send(message: any) {

  }

  static receive(wsmsg: string) {
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

  static terminate() {
    const ws = RealtimeService.ws;

    if (!ws) return;

    ws.close(1000);

    ws.removeEventListener("open", onOpen);
    ws.removeEventListener("error", onError);
    ws.removeEventListener("close", onClose);
    ws.removeEventListener("message", onMessage);
  }
}
