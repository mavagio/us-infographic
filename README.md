The following README provides steps on how to run the code locally.
The application is deployed at: https://usinfo.herokuapp.com/
## How to run locally



Run the code: front end
---------------
### Prerequisites
Make sure to have the following installed on your machine:
- Node > 8.9 (!important)
<a/>
The following is an Angular 6 single page application, therefore it is possible to only run the front end without the server.
For that run the following commands:

```
cd client; npm i; npm start
```

Run the code: back end
---------------
## Prerequisites
Make sure to have the following installed on your machine:
- mongoDB (make sure to have mongod running locally when running the code on a local machine)
- Node > 8.9 (!important)
### Steps
- Install dependencies. From root directory run:
```
npm run install:dependencies
```
- Create .env file in server folder.
- Copy the following lines to .env file.
```
PORT=3000
DEV_DB='mongodb://localhost/us_info_db'
NODE_ENV='development'
JWT_SECRET='change_this_example_secret'
```
- (Optional) Add the following to .env file if you want to run MongoDB with cloud provider (e.g. Mlab):
```
PROD_DB={{the URI provided by mongoDB could providers, e.g. Mlab}}
```
- Run the application by starting the client and server separately:
```
cd server; npm start
```
```
cd client; npm start
```
This will create the database locally. By running the server with the command:
```
npm run start:cloud
```
## Technology stack
MEAN Stack with TypeScript
- MongoDB
- Angular 6+
- Express
- Node > 8.9
- TypeScript
- JavaScript
