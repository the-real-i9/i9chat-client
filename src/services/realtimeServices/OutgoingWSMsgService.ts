export default class OutgoingWSMessageService {
  /** @type {WebSocket} Websocket instance */
  static ws = null;
  
  /** @param {WebSocket} ws Websocket instance */
  static init(ws) {
    OutgoingWSMessageService.ws = ws
  }

  send(message) {
    console.log(message)
  }
}
