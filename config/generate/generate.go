package generate

import (
	"path/filepath"

	"github.com/otiai10/copy"
)

var (
	// ConfigTemplatesDir is the absolute path to the config templates directory.
	// It's set at build time using an -X flag. eg -ldflags "-X github.com/mokitanetwork/aetool/config/generate.ConfigTemplatesDir=/home/user1/aetool/config/templates"
	ConfigTemplatesDir string
)

func GenerateDefaultConfig(generatedConfigDir string) error {
	if err := GenerateAethConfig("v0.10", generatedConfigDir); err != nil {
		return err
	}
	if err := GenerateBnbConfig(generatedConfigDir); err != nil {
		return err
	}
	if err := GenerateDeputyConfig(generatedConfigDir); err != nil {
		return err
	}
	return nil
}

func GenerateAethConfig(aethConfigTemplate, generatedConfigDir string) error {
	// copy templates into generated config folder
	err := copy.Copy(filepath.Join(ConfigTemplatesDir, "aeth", aethConfigTemplate), filepath.Join(generatedConfigDir, "aeth"))
	if err != nil {
		return err
	}

	// put together final compose file
	err = overwriteMergeYAML(
		filepath.Join(ConfigTemplatesDir, "aeth", aethConfigTemplate, "docker-compose.yaml"),
		filepath.Join(generatedConfigDir, "docker-compose.yaml"),
	)
	return err
}

func GenerateBnbConfig(generatedConfigDir string) error {
	// copy templates into generated config folder
	err := copy.Copy(filepath.Join(ConfigTemplatesDir, "binance/v0.8"), filepath.Join(generatedConfigDir, "binance"))
	if err != nil {
		return err
	}

	// put together final compose file
	err = overwriteMergeYAML(
		filepath.Join(ConfigTemplatesDir, "binance/v0.8/docker-compose.yaml"),
		filepath.Join(generatedConfigDir, "docker-compose.yaml"),
	)
	return err
}

func GenerateDeputyConfig(generatedConfigDir string) error {
	// copy templates into generated config folder
	err := copy.Copy(filepath.Join(ConfigTemplatesDir, "deputy"), filepath.Join(generatedConfigDir, "deputy"))
	if err != nil {
		return err
	}

	// put together final compose file
	err = overwriteMergeYAML(
		filepath.Join(ConfigTemplatesDir, "deputy/docker-compose.yaml"),
		filepath.Join(generatedConfigDir, "docker-compose.yaml"),
	)
	return err
}

func GenerateIbcChainConfig(generatedConfigDir string) error {
	// copy templates into generated config folder
	err := copy.Copy(filepath.Join(ConfigTemplatesDir, "ibcchain", "master"), filepath.Join(generatedConfigDir, "ibcchain"))
	if err != nil {
		return err
	}

	// put together final compose file
	err = overwriteMergeYAML(
		filepath.Join(ConfigTemplatesDir, "ibcchain", "master", "docker-compose.yaml"),
		filepath.Join(generatedConfigDir, "docker-compose.yaml"),
	)
	return err
}

func GenerateGethConfig(generatedConfigDir string) error {
	// copy templates into generated config folder
	err := copy.Copy(filepath.Join(ConfigTemplatesDir, "geth"), filepath.Join(generatedConfigDir, "geth"))
	if err != nil {
		return err
	}

	// put together final compose file
	err = overwriteMergeYAML(
		filepath.Join(ConfigTemplatesDir, "geth", "docker-compose.yaml"),
		filepath.Join(generatedConfigDir, "docker-compose.yaml"),
	)
	return err
}

func GenerateHermesRelayerConfig(generatedConfigDir string) error {
	err := copy.Copy(filepath.Join(ConfigTemplatesDir, "hermes"), filepath.Join(generatedConfigDir, "hermes"))
	return err
}

func AddHermesRelayerToNetwork(generatedConfigDir string) error {
	return overwriteMergeYAML(
		filepath.Join(ConfigTemplatesDir, "hermes", "docker-compose.yaml"),
		filepath.Join(generatedConfigDir, "docker-compose.yaml"),
	)
}

func GenerateGoRelayerConfig(generatedConfigDir string) error {
	err := copy.Copy(filepath.Join(ConfigTemplatesDir, "relayer"), filepath.Join(generatedConfigDir, "relayer"))
	return err
}
