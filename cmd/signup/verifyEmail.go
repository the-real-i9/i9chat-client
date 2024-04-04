package signupcmd

import (
	"context"
	"fmt"
	"i9chatClient/utils/globals"
	"i9chatClient/utils/helpers"
	apptypes "i9chatClient/utils/types"

	"nhooyr.io/websocket"
	"nhooyr.io/websocket/wsjson"
)

func verifyEmail(email string) {
	connStream, err := helpers.WSConnect("/api/auth/signup/verify_email", helpers.Getenv("SIGNUP_SESSION_JWT"))
	if err != nil {
		helpers.Print(err)
		return
	}

	defer connStream.CloseNow()

	closeNormal := func() {
		connStream.Close(websocket.StatusNormalClosure, "done")
	}

	fmt.Printf("Enter the 6-digit code sent to '%s':\n", email)

	for {
		var input string

		if input == globals.ControlQuit {
			fmt.Println("Quiting signup session...")
			closeNormal()
			return
		}

		var code int
		_, err := fmt.Sscanf(input, "%d", code)
		if err != nil {
			fmt.Println("Code format error. Retry. Ex:> 123456")
			continue
		}

		sendData := map[string]int{"code": code}

		w_err := wsjson.Write(context.Background(), connStream, sendData)
		if w_err != nil {
			helpers.Print(fmt.Errorf("signup.go: verifyEmail: Write error: %s", w_err))
			return
		}

		var recvData apptypes.WSResp

		r_err := wsjson.Read(context.Background(), connStream, &recvData)
		if r_err != nil {
			helpers.Print(fmt.Errorf("signup.go: verifyEmail: Read error: %s", r_err))
			return
		}

		if recvData.StatusCode != 200 {
			helpers.Print(fmt.Errorf("signup error: %s", recvData.Error))
			fmt.Println("Re-enter 6-digit code. OR. Quit the session and start over the signup")
			continue
		}

		helpers.Print(recvData.Body["msg"])
		break
	}

	go closeNormal()
	registerUser()
}
