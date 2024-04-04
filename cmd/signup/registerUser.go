package signupcmd

import (
	"context"
	"fmt"
	"i9chatClient/utils/globals"
	"i9chatClient/utils/helpers"
	apptypes "i9chatClient/utils/types"
	"strings"

	"nhooyr.io/websocket"
	"nhooyr.io/websocket/wsjson"
)

func registerUser() {
	connStream, err := helpers.WSConnect("/api/auth/signup/register_user", helpers.Getenv("SIGNUP_SESSION_JWT"))
	if err != nil {
		helpers.Print(err)
		return
	}

	defer connStream.CloseNow()

	closeNormal := func() {
		connStream.Close(websocket.StatusNormalClosure, "done")
	}

	for {
		var (
			username string
			password string
		)

		for {
			var input string

			fmt.Print("Username: ")
			fmt.Scanf("%s", &input)

			if input == globals.ControlQuit {
				helpers.Print("Quiting signup session...")
				closeNormal()
				return
			}

			_, err := fmt.Sscanf(input, "%s", &username)
			if err != nil || strings.Trim(username, " ") == "" {
				helpers.Print("Invalid username input")
				continue
			}
			break
		}

		for {
			var input string

			fmt.Print("Password: ")
			fmt.Scanf("%s", &input)

			if input == globals.ControlQuit {
				helpers.Print("Quiting signup session...")
				closeNormal()
				return
			}

			_, err := fmt.Sscanf(input, "%s", &password)
			if err != nil || strings.Trim(password, " ") == "" {
				helpers.Print("Invalid password input")
				continue
			}
			break
		}

		sendData := map[string]string{"username": username, "password": password, "geolocation": "2,5,5"} // get geolocation somehow

		w_err := wsjson.Write(context.Background(), connStream, sendData)
		if w_err != nil {
			helpers.Print(fmt.Errorf("signup.go: registerUser: Write error: %s", w_err))
			return
		}

		var recvData apptypes.WSResp

		r_err := wsjson.Read(context.Background(), connStream, &recvData)
		if r_err != nil {
			helpers.Print(fmt.Errorf("signup.go: registerUser: Read error: %s", r_err))
			return
		}

		if recvData.StatusCode != 200 {
			helpers.Print(fmt.Errorf("signup error: %s", recvData.Error))
			continue
		}

		helpers.Unsetenv("SIGNUP_SESSION_JWT")

		// print message
		helpers.Print(recvData.Body["msg"])
		// store user data
		go globals.LocalStorage.SetItem("user", recvData.Body["user"])
		// store auth token
		go helpers.Setenv("AUTH_JWT_TOKEN", recvData.Body["jwtToken"].(string))

		break
	}
	closeNormal()
}
