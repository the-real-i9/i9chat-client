package apptypes

import (
	"encoding/json"
	"errors"
	"io/fs"
	"os"
)

var localStorageFile = "localStorage.json"

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
	lsData, _ := json.MarshalIndent(ls.storage, "", "  ")

	os.WriteFile(localStorageFile, lsData, 0644)
}

func (ls *LocalStorage) Revive() error {
	lsData, err := os.ReadFile(localStorageFile)
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
