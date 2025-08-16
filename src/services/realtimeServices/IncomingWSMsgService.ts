export default class IncomingWSMessageService {
  static foward(msg: string) {
    const { event, data } = JSON.parse(msg)

    switch (event) {
      case "sample message":
        console.log(data)
        break;
      default:
        break;
    }
  }
}
