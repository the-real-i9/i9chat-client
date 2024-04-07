package apptypes

type WSResp struct {
	StatusCode int            `json:"statusCode"`
	Body       map[string]any `json:"body"`
	Error      string         `json:"error"`
}
