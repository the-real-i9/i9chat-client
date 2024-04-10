package cmd

import (
	"bufio"
	"fmt"
	listcmd "i9chat/client/cmd/list"
	signupcmd "i9chat/client/cmd/signup"
	"i9chat/client/utils/helpers"

	"os"
	"strings"
)

func printHelp() {
	fmt.Print(`
i9chat version 1.0

signup  - create an account
login   - log in user

`,
	)
}

func Execute() {
	fmt.Print("A command line client application for i9chat.\n\n")

	for {
		fmt.Print("i9chat> ")

		input := bufio.NewScanner(os.Stdin)
		input.Scan()
		inputCmd := strings.ToLower(input.Text())

		rootCmd, restParts, _ := strings.Cut(inputCmd, " ")

		switch rootCmd {
		case "signup":
			signupcmd.Execute(restParts)
		case "list":
			listcmd.Execute(restParts)
		case "help":
			printHelp()
		case "exit":
			helpers.Print("See you later...")
			return
		case "":
			continue
		default:
			printHelp()
		}
	}
}
