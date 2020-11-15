help:
	@echo "\n\
Here is the list of available targets:\n\
\thelp (default): prints help\n\
\tup: starts docker-compose\n\
\tdown: stops docker-compose\n\
\tbuild: builds application\n\
"
up:
	docker-compose --file "$(PWD)/docker/docker-compose.yml" up --build&

down:
	docker-compose --file "$(PWD)/docker/docker-compose.yml" down

restart:
	make down && make up

build:
	docker-compose --file "$(PWD)/docker/docker-compose.yml" exec gradle\
		/bin/bash -c "cd /opt/app && ./gradlew clean assembleDebug"