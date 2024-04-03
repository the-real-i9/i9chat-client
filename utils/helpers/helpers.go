package helpers

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
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

func WSConnect(rawUrl string, includeAuth bool) (connStream io.ReadCloser, err error) {
	u, err := url.Parse(rawUrl)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("GET", u.String(), nil)
	if err != nil {
		return nil, err
	}

	secWebsocketKey := base64.StdEncoding.EncodeToString(GetRandomBytes(16))

	req.Header.Set("Connection", "Upgrage")
	req.Header.Set("Upgrade", "websocket")
	req.Header.Set("Sec-WebSocket-Version", "13")
	req.Header.Set("Sec-WebSocket-Key", secWebsocketKey)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	if res.StatusCode != http.StatusSwitchingProtocols {
		return nil, fmt.Errorf("websocket handshake failed with status %d", res.StatusCode)
	}

	return res.Body, nil
}
