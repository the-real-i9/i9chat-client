package apptypes

import "time"

type AppUser struct {
	Id       int       `json:"id"`
	Username int       `json:"username"`
	Presence string    `json:"presence"`
	LastSeen time.Time `json:"last_seen"`
}
