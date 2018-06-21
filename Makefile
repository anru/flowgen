export PATH := $(CURDIR)/node_modules/.bin:$(PATH)
SHELL := env PATH=$(PATH) /bin/sh

sources := $(wildcard src/*.js) $(wildcard src/**/*.js) $(wildcard src/**/**/*.js)

.PHONY: lib
lib: .lib.stub

.lib.stub: $(sources) .babelrc
	babel --out-dir lib ./src
	touch $@

.PHONY: watch
watch: lib
	babel --out-dir lib --skip-initial-build -w ./src

.PHONY: prettify
prettify:
	prettier --write "{src,types}/**/*.js"

.PHONY: clean
clean:
	rm -rf lib .lib.stub
