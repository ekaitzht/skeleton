
### How to run the project

1. Create a .env file to load the environment variables. You will need to set up your Google Geocoding API_KEY and your email PASSWORD. You will also need to enable insecure applications to your email account https://support.google.com/accounts/answer/6010255

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

Note: I had to use -d option to detach the process from the stdout, I tried to do mongod --fork but it was exiting the parent process and stopping the MongoDB process.


### APIS:


#I implemented 4 endpoints:

* `POST /validate` this request receives a body payload with address and checks if it’s valid. If the address is valid, it sends back a 200 error, if not, it sends back a 400 error.
* `GET /geocoding?address=[fullAdress]` will return `[latitude, longitude]`. This endpoint will call Google Geocoding API.
* `GET /weather` this endpoint has 2 options. 

First option you can send an address query param, It will call to `/geocoding` endpoint to get the latitude and longitude then It will store this information (address+location) in a MongoDB document after it will get the weather.

Second option sends directly lat & lng to the endpoint. The endpoint won’t spend time geocoding and it will send back the current weather for that lat & lng. This decision has been made to use this endpoint for the batch process to get the weather without doing the geocoding process saving time and money.

* `POST /validateandweather` this endpoint is the entry point of the project. It will call to `/validate` to validate the address object.  If it is valid, it will call to `/weather` endpoint. 

#Below you have 2 curl requests to the API  to use it to try the endpoints:

```
curl -X POST http://localhost:3000/validateandweather --header "Content-Type: application/json" -d '{"street":"Glandore Road","streetNumber":"9","town":"Dublin","postalCode":"D9","country":"Ireland"}'
```
```
curl http://localhost:3000/weather?address=%22Calle%20Cortes%20de%20Navarra,3,Pamplona,Navarra,%20Spain%22
```

### Architectural design

First architectural design:

![github image](https://drive.google.com/uc?id=1Bf1IK3G0DQSVaBt0ZiTeZMvgMLFnRLe6)

The above diagram reflects the intent architecture of the initial plan design. The goal was to have the cron job in its own container and using a crontab file to trigger the cron job. This design was made to have better reliability so if Nodejs app fails still the cronjob can call to MongoDB and continue to send emails. Second advantage the containerize cron job yields better deployability, better DevOps practices with CI/CD and a more cloud native application. 

However, I am developing with Mac Os X and to call to the host machine from the container is different from Linux. Because I didn't know in what kind of environment you would run my application I decided to do the cronjob in the same node process than the API you can see this design in the below image. 

Final architectural design:

![github image 2](https://drive.google.com/uc?id=1Z76hh5SrhQQDIA5ozmUqXXN0Gq6Zd3l_)

### Optional schedule

For this problem, I will support multiple users. I will have  User class with 3 properties timeframe, email and optionally addresses which each user is subscribed.  Also, I will have another class Notifier that will add callbacks to each timeframe of each user, those callbacks will be responsible to send the notifications to the emails of the users each time that reach the timeframe.

### How to deploy this architecture to AWS

1. Develop your code in a feature branch.
2. Push your code to GitHub this will trigger a CI/CD tool like Jenkins, Travis CI, etc.
3. The CI/CD tool will build your docker containers and run your unit tests, integration tests and contract testing. Also, it could run other tools like SonarQube, security scanners, etc.
4. Open a pull request and review the code with your workmates. 
5. If the tests are green you could merge your branch.
6. The CI/CD tool will build a production image and push to a docker registry like Docker Hub. 
7. After this push to Docker Hub AWS will pull the image from Docker hub to deploy. For a production environment, we would have a QA environment, preprod environment, etc, in which more heavy tests will execute like e2e tests, performance testing, etc. Also, I am not going to go into details but for AWS technology to use but we could use EC2, ELK stack for more scalability/flexibility, or to use a simple AWS Beanstalk server if we don't want a lot of control.

