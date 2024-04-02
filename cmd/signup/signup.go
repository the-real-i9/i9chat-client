package signupcmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

var (
	email string

	SignupCmd = &cobra.Command{
		Use:   "signup",
		Short: "Create your Account",
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Println(email)
		},
	}
)

func init() {
	SignupCmd.Flags().StringVar(&email, "email", "", "Account request email")
	SignupCmd.MarkFlagRequired("email")
}
