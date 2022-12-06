install:
	go install -ldflags "-X github.com/MokitaNetwork/aetool/config/generate.ConfigTemplatesDir=$(CURDIR)/config/templates"