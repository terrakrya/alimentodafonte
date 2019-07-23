-include env_make

default: run

run:
	sudo docker-compose up -d

in-teste:
	sudo docker exec -it sementes_teste /bin/bash

in-teste-with-root:
	sudo docker exec --user root -it sementes_cerrado /bin/bash

stop:
	sudo docker-compose stop

clean:
	sudo docker-compose down --remove-orphans

build:
	sudo docker-compose build

stage-run:
	sudo docker-compose -f docker-compose-stage.yml up -d

stage-stop:
	sudo docker-compose -f docker-compose-stage.yml stop

prod-run:
	sudo docker-compose -f docker-compose-production.yml up -d

prod-build:
	sudo docker-compose -f docker-compose-production.yml build

prod-stop:
	sudo docker-compose -f docker-compose-production.yml stop
