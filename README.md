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


