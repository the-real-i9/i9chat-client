package listcmd

import (
	"fmt"
	"i9chat/client/utils/helpers"
)

func printHelp() {
	fmt.Print(`
i9chat version 1.0

users  - a list of i9chat users
chats  - a list of your chats

`,
	)
}

func Execute(subCmd string) {
	if subCmd == "" || subCmd == "help" {
		printHelp()
		return
	}

	switch subCmd {
	case "users":
		executeUsersListing()
	case "chats":
		executeChatsListing()
	default:
		helpers.Print("Incorrect use of command: list")
		printHelp()
		return
	}
}
