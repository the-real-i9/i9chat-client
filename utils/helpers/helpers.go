package helpers

import (
	"context"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"i9chatClient/utils/globals"

	"nhooyr.io/websocket"
)

func Print(val ...any) {
	fmt.Println()
	fmt.Println(val...)
	fmt.Println()
}

func ToJSON(val any) string {
	bt, _ := json.Marshal(val)

	return string(bt)
}

func GetRandomBytes(length int) []byte {
	randomBytes := make([]byte, length)

	rand.Read(randomBytes)

	return randomBytes
}

func WSConnect(path string, authToken string) (connStream *websocket.Conn, err error) {
	dialOptions := &websocket.DialOptions{}

	if authToken != "" {
		dialOptions.HTTPHeader.Set("Authorization", authToken)
	}

	conn, _, err := websocket.Dial(context.Background(), "ws://localhost:8000"+path, dialOptions)

	if err != nil {
		return nil, fmt.Errorf("WSConnect: websocket.Dial: %s", err)
	}

	return conn, nil
}

func ReviveLocalStorage() error {
	return globals.LocalStorage.Revive()
}
