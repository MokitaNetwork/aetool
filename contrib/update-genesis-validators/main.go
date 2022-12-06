package main

import (
	"github.com/MokitaNetwork/aether/app"
	"github.com/MokitaNetwork/aetool/contrib/update-genesis-validators/cmd"
)

func main() {
	app.SetSDKConfig()
	cmd.Execute()
}
