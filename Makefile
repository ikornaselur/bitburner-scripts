server:
	cd scripts && python -m http.server 9999

prettier:
	npm run format

lint:
	npm run lint

clean:
	rm -rf ./dist

build: clean
	npx tsc

deploy: build
	python deploy.py

test:
	npm test
