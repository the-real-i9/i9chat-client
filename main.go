package main

import (
	"i9chatClient/cmd"
	"i9chatClient/utils/helpers"
	"log"
)

func main() {
	if err := helpers.Loadenv(); err != nil {
		log.Fatalln(err)
	}

	if err := helpers.ReviveLocalStorage(); err != nil {
		log.Fatalln(err)
	}

	cmd.Execute()
}
