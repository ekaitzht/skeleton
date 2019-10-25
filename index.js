
const express = require('express');
const bodyParser = require('body-parser')
const axios = require('axios');
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

getLatLng = async (address) =>{
    const apiKey = 'AIzaSyCQTqvvgVbyyUdLMVIEAcyzMp3YRUlAI7Y';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;

    try { 
        const { results } = (await axios.get(url)).data;
        const { location } = results.pop().geometry;
        return location;
    } catch (error) {
        throw Error(error);
    }
}

app.get('/weather', async (req, res) =>{

    const { address } = req.query;
    console.log('here', address)
    try {
        const location = await getLatLng(address);
        res.json(location);
    } catch (error) {
        res.json(error);
    }
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

