### How to run the project

1. Create a .env file to load the environment variables. Remember that you need set up your Google Geocoding API_KEY and you email PASSWORD. You will need to enable Insecure applications to your email account https://support.google.com/accounts/answer/6010255

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

```npm install```

3. Build docker compose

``` docker-compose build```

4. Run project with:

```docker-compose up -d & npm start```

Note: I had to use -d option to detach process from the stdout, I tried to do mongod --fork but it was exiting the parent process and stopping the mongodb process.


### APIS:

Endpoints:

I created 4 endpoints:
* POST /validate in the body payload you need to send the address object if it doesn't have the required properties will send back 400 error, and if it is valid 200 status code.
* GET /geocoding?address=[fullAdress] will return [latitude, longitude] this endpoint will call to Google Geocoding API
* GET /weather this endpoint has 2 options if you send address query param  will proceed to call to /geocoding endpoint to get the latitude and longitude and then store this information (address+location) in a MongoDB document with [Mongoose](https://github.com/ekaitzht/wefox/blob/master/models/address.js). If you send the address you can send the latitude and longitude and the endpoint won't spend time and 💰to call the Google Geocoding api. This decision has been made to use this endpoint for the batch process to get the weather without doing the geocoding proccess.
* POST /validateandweather this endpoint is the entry point of the project it will call to /validate to validate the address object if it is valid will get call to /weather endpoint. 

Here I leave some curl requests to the API:

```
curl -X POST http://localhost:3000/validateandweather --header "Content-Type: application/json" -d '{"street":"Glandore Road","streetNumber":"9","town":"Dublin","postalCode":"D9","country":"Ireland"}'
```
```
curl http://localhost:3000/weather?address=%22Calle%20Cortes%20de%20Navarra,3,Pamplona,Navarra,%20Spain%22
```

### Architectural design

First architectural design:

![github image](https://drive.google.com/uc?id=1Bf1IK3G0DQSVaBt0ZiTeZMvgMLFnRLe6)

The above diagram reflects the intent architecture of the initial plan design. The goal was to have the cron job in his own container. The goal for this it was first better reliability if cron the nodejs fails still the cronjob can still to call to mongodb and continue to request to mongodb to send emails. Second if better to have the cronjob containerize to better deployability and bettter Devops practices with CI/CD.

However I am developing with Mac Os X and to call to the host machine from the container can give problems if you are using Linux. for this reason I decided to do the cronjob in the same nodes process than the API. 

Final architectural design:

![github image 2](https://drive.google.com/uc?id=1Z76hh5SrhQQDIA5ozmUqXXN0Gq6Zd3l_)

### Optional schedule

For this problem I will support multiple users. I will have User class with information related with timeframe, email and  optionally if he wants only to addresses that the user is subscribed. Also we will have another class Notifier that will add a callbacks to each timeframe of each user those callbacks were responsible to send the notifications to the emails of the users.

### How to deploy this architecture to AWS

1. Develop your code in a feature branch.
2. Push your code to github this will trigger a CI/CD tool like Jenkins, Travis CI, etc.
3. The CI/CD tool will build your docker containers and run your unit tests and integration tests. Also it could run other tools like SonarQube, security scanners, etc.
4. Open a pull request and review the code with your workmates. 
5. If the tests are green you could merge your branch.
6. The CI/CD tool will build a production image and pushed to docker registry like Docker Hub. 
7. After this push to Docker Hub AWS will push the image from Docker hub to deploy. I am omitting that in a production environment we will have QA environment also a preprod environment where more heavy tests will execute like e2e tests, performance testing, etc. Also I not mentioning the kind of architeture we want to use in AWS we could use EC2, ELK stack for more scability/flexibilty, or to use a simple AWS Beanstalk server if we don't want a lot control.
