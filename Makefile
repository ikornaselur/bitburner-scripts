server:
	cd scripts && python -m http.server 9999

prettier:
	prettier scripts/*.js --write
