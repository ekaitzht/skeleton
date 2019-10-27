### How to run the project

1. Create a .env file. Remember that you need set up your Google Geocoding api key and you email password. You will need to enable Insecure applications to your email accountt https://support.google.com/accounts/answer/6010255

```
API_KEY=api_key
MONGODB_PORT=27017
PORT=3000
HOSTNAME=localhost
EMAIL_FROM=asuntroyas@gmail.com
PASSWORD=password
EMAIL_TO=ekaitz7@gmail.com
```

2. Install your node packages

``` npm install```

3. Run with docker-compose up -d & npm start ( I had to use -d option to dettach the from the output the project I tried to do mongod --fork but it was exiting the parent process and stopping the project).


### APIS:

Endpoints:

I created 4 endpoints:
* POST /validate in the body payload you need to send the address object if it doesn't have the required properties will send 400 error if is valid 200 status code.
* GET /geocoding?address=[fullAdress] will return [latitude, longitude]
* GET /weather this endpoint has 2 options if you send address query param  will proceed to call to /geocoding to get the latitude and longitude and then store this information in MongoDB document with [Mongoose](https://github.com/ekaitzht/wefox/blob/master/models/address.js). If you send the address you can send the latitude and longitude and the endpoint won't spend time and 💰to call the Google Geocoding api. This decision has been made to use this endpoint for the batch process to get the weather without doing the geocoding proccess.
* POST /validateandweather this endpoint is like the entry point of the project it will call to /validate to validate the address object is valid and if is valid will get call to /weather endpoint. 


### Architectural design

First architectural design:

![github image](https://drive.google.com/uc?id=1Bf1IK3G0DQSVaBt0ZiTeZMvgMLFnRLe6)

Final architectural design:

![github image 2](https://drive.google.com/uc?id=1Z76hh5SrhQQDIA5ozmUqXXN0Gq6Zd3l_)




