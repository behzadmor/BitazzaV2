># How to install
### 1. install node.js (version 16+) and nodemon
### 2. go to **Backend** folder
### 3. `npm intsall`
### 4. set PORT in file **config/config.env** - the default PORT is 1337
### 5. `npm start`
---

## All topPerformers(this task) routes start with
* ## **/api/topPerformers**

## Routes are as follow

|Route|Method|Body Parameters|Purpose|
|-----|------|---------------|-------|
|/topGainers|post|fromDate,toDate|Returns top five Gainers in the time period specified|
|/topLosers|post|fromDate,toDate|Returns top five Losers in the time period specified|
|/topFiveGainersAndLosers|post|fromDate,toDate|Returns both top five Gainers and top five Losers in the time period specified|
|/login|get| |Redirects to front-end Login Page|
---

># Swagger Documentation
### To see Swagger API Documentation UI go to address **/api-docs** in your browser.

># Docker
### There is a Dockerfile in **backend** folder.
### To  create the container and run the app using Docker follow the steps below:
### 1. Go to **backend** folder.
### 2. Open a VS Code terminal there.
### 3. type `docker build -t bitazza .`
### 4. type `docker run -p 1337:1337 bitazza`
---
># Unit Tesing Using Mocha and Chai
### There are five sample Unit tests for API endpoints, Use `npm test` to run the tests.

># TypeScript
### There is a **TypeScript** version of the app in folder **backend/typescriptVersion** .
### Note: This TypeScript Version is written in just an hour, so it's not very optimised.



