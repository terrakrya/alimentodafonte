-include env_make

.PHONY: test

drupal ?= 8
php ?= 7.2

default: run

run:
	docker-compose up -d

in:
	docker-compose exec nginx /bin/bash

in-with-root:
	docker-compose exec --user root nginx /bin/bash

stop:
	docker-compose stop

clean:
	docker-compose down

build:
	docker-compose build

stage-run:
	docker-compose -f docker-compose-stage.yml up -d

stage-stop:
	docker-compose -f docker-compose-stage.yml stop
