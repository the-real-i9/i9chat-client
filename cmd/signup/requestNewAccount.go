package signupcmd

import (
	"context"
	"fmt"
	"i9chat/client/utils/apptypes"
	"i9chat/client/utils/globals"
	"i9chat/client/utils/helpers"

	"nhooyr.io/websocket"
	"nhooyr.io/websocket/wsjson"
)

func requestNewAccount(email string) {
	sendData := map[string]string{"email": email}

	connStream, err := helpers.WSConnect("/api/auth/signup/request_new_account", "")
	if err != nil {
		helpers.Print(err)
		return
	}

	defer connStream.CloseNow()

	closeNormal := func() {
		connStream.Close(websocket.StatusNormalClosure, "done")
	}

	for {
		w_err := wsjson.Write(context.Background(), connStream, sendData)
		if w_err != nil {
			helpers.Print(fmt.Errorf("signup.go: requestNewAccount: Write error: %s", w_err))
			return
		}

		var recvData apptypes.WSResp

		r_err := wsjson.Read(context.Background(), connStream, &recvData)
		if r_err != nil {
			helpers.Print(fmt.Errorf("signup.go: requestNewAccount: Read error: %s", r_err))
			return
		}

		if recvData.StatusCode != 200 {
			helpers.Print(fmt.Errorf("signup error: %s", recvData.Error))
			fmt.Println("Re-enter email:")

			var newInput string
			fmt.Scanf("%s", &newInput)

			if newInput == globals.ControlQuit {
				fmt.Println("Quiting signup session...")
				closeNormal()
				return
			}

			sendData["email"] = newInput

			continue
		}

		globals.LocalStorage.SetItem("signup_session_jwt", recvData.Body["signup_session_jwt"].(string))
		break
	}

	go closeNormal()
	verifyEmail(email)
}
