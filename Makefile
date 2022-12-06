install:
	go install -ldflags "-X github.com/mokitanetwork/aetool/config/generate.ConfigTemplatesDir=$(CURDIR)/config/templates"