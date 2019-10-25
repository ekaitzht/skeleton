
const express = require('express');
const bodyParser = require('body-parser')
require('dotenv').config()

const {getWeather, getLatLng} = require('./utils');

const { check, validationResult } = require('express-validator');

const app = express();

app.use( bodyParser.json() );       

app.use(bodyParser.urlencoded({     
  extended: true
}));

app.post('/address',[
    check('street').exists(),
    check('streetNumber').exists(),
    check('town').exists(),
    check('postalCode').exists(),
    check('country').exists()
  ], (req, res) => {
    
    console.log('req.body', req.body)
    const { street, streetNumber, town, postalCode, country}  = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.json({
            valid: false
        })
    } 

    res.json({
        valid: true
    })
});

app.get('/weather', async (req, res) =>{

    const { address } = req.query;
    console.log('here', address)
    try {
        const location = await getLatLng(address);
        const data = await getWeather(location);
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});

app.post('/validateandweather', async (req, res) =>{

    const address  = req.body

    console.log('here', address)
    try {
        const location = await axios.post('/validate',{address});
        const data = await getWeather('/weather');
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

