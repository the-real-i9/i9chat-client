package listcmd

import (
	"context"
	"fmt"
	"i9chatClient/utils/globals"
	"i9chatClient/utils/helpers"
	apptypes "i9chatClient/utils/types"

	"nhooyr.io/websocket"
	"nhooyr.io/websocket/wsjson"
)

func executeUsersListing() {
	connStream, err := helpers.WSConnect("/api/app/user/all_users", globals.LocalStorage.GetItem("auth_jwt").(string))
	if err != nil {
		helpers.Print(err)
		return
	}

	defer connStream.CloseNow()

	closeNormal := func() {
		connStream.Close(websocket.StatusNormalClosure, "done")
	}

	var recvData apptypes.WSResp

	r_err := wsjson.Read(context.Background(), connStream, &recvData)
	if r_err != nil {
		helpers.Print(fmt.Errorf("pkg_listcmd: users.go: executeUsersListing: Read error: %s", r_err))
		return
	}

	var users []apptypes.AppUser

	helpers.ParseTo(recvData.Body["all_users"], &users)

	// print users to command line

	closeNormal()
}
