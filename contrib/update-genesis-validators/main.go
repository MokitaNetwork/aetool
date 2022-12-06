package main

import (
	"github.com/MokitaNetwork/aether/app"
	"github.com/mokitanetwork/aetool/contrib/update-genesis-validators/cmd"
)

func main() {
	app.SetSDKConfig()
	cmd.Execute()
}
