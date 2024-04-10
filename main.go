package main

import (
	"i9chatClient/cmd"
	"i9chatClient/utils/helpers"
	"log"
)

func main() {
	if err := helpers.InitLocalStorage(); err != nil {
		log.Fatalln(err)
	}

	cmd.Execute()
}
