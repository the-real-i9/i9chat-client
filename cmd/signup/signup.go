package signupcmd

import (
	"fmt"
	"i9chat/client/utils/helpers"
)

func printHelp() {
	fmt.Print(`
Usage:
  signup email=example@mail.com

`)
}

func Execute(arg string) {
	if arg == "" || arg == "help" {
		printHelp()
		return
	}

	var email string
	_, err := fmt.Sscanf(arg, "email=%s", &email)
	if err != nil || email == "" {
		helpers.Print("Incorrect use of command: signup")
		printHelp()
		return
	}

	requestNewAccount(email)
}
