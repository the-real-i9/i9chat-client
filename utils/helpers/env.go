package helpers

import (
	"encoding/json"
	"os"
)

const envFile string = "env.json"

func Loadenv() error {
	env, err := os.ReadFile(envFile)
	if err != nil {
		return err
	}

	if len(env) < 1 {
		return nil
	}

	var envKV = make(map[string]string)

	json.Unmarshal(env, &envKV)

	for key, value := range envKV {
		if err := os.Setenv(key, value); err != nil {
			return err
		}
	}

	return nil
}

func Setenv(key string, value string) error {
	if err := os.Setenv(key, value); err != nil {
		return err
	}

	go func() {
		oldEnv, _ := os.ReadFile(envFile)

		var envKV = make(map[string]string)

		json.Unmarshal(oldEnv, &envKV)

		envKV[key] = value

		newEnv, _ := json.Marshal(envKV)

		os.WriteFile(envFile, newEnv, 0644)
	}()

	return nil
}

func Unsetenv(key string) error {
	if err := os.Unsetenv(key); err != nil {
		return err
	}

	go func() {
		oldEnv, _ := os.ReadFile(envFile)

		var envKV = make(map[string]string)

		json.Unmarshal(oldEnv, &envKV)

		delete(envKV, key)

		newEnv, _ := json.Marshal(envKV)

		os.WriteFile(envFile, newEnv, 0644)
	}()

	return nil
}
