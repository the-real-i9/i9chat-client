package main

import (
	"i9chat/client/cmd"
	"i9chat/client/utils/helpers"
	"log"
)

func main() {
	if err := helpers.InitLocalStorage(); err != nil {
		log.Fatalln(err)
	}

	cmd.Execute()
}
