package apptypes

import (
	"encoding/json"
	"errors"
	"io/fs"
	"os"
)

type WSResp struct {
	StatusCode int            `json:"statusCode"`
	Body       map[string]any `json:"body"`
	Error      string         `json:"error"`
}

type LocalStorage struct {
	storage map[string]any
}

func (ls LocalStorage) GetItem(key string) any {
	return ls.storage[key]
}

func (ls *LocalStorage) SetItem(key string, value any) {
	ls.storage[key] = value

	ls.save()
}

func (ls *LocalStorage) DeleteItem(key string) {
	delete(ls.storage, key)

	ls.save()
}

func (ls *LocalStorage) save() {
	lsData, _ := json.Marshal(ls.storage)

	os.WriteFile("localStorage.json", lsData, 0644)
}

func (ls *LocalStorage) Revive() error {
	lsData, err := os.ReadFile("localStorage.json")
	if err != nil && !errors.Is(err, fs.ErrNotExist) {
		return err
	}

	var store = make(map[string]any)

	if len(lsData) > 1 {
		json.Unmarshal(lsData, &store)
	}

	ls.storage = store

	return nil
}
