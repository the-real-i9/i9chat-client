package main

import (
	"bufio"
	"fmt"
	"i9chatClient/cmd"
	signupcmd "i9chatClient/cmd/signup"
	"os"
	"strings"
)

func main() {
	// cmd.Execute()

	fmt.Print("A command line client application for i9chat.\n\n")
	for {
		fmt.Print("i9chat> ")

		input := bufio.NewScanner(os.Stdin)
		input.Scan()
		inputCmd := input.Text()

		rootCmd, rest, _ := strings.Cut(inputCmd, " ")

		switch rootCmd {
		case "signup":
			signupcmd.Execute(rest)
		case "help":
			cmd.PrintHelp()
		case "exit":
			fmt.Print("\nSee you later...\n\n")
			return
		case "":
			continue
		default:
			cmd.PrintHelp()
		}
	}
}
