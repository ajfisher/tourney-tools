.PHONY: help lint test build

deploy-api:
	@echo "Deploying API"
	cd ./api && sls deploy --remoteddb=true

deploy-app:
	@echo "Deploying the web application"
	cd ./app/build && aws s3 sync . s3://web-bout-haus-prod/ --delete
