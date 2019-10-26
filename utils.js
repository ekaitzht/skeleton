const axios = require('axios');
const logger = require('./logger');

getLatLng = async (address) =>{
    console.log('perico', address)
    
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.API_KEY}`;
    
    try { 
        const { results } = (await axios.get(url)).data;
        const { location } = results.pop().geometry;
        logger.info(`Geocoded ${address} to`, location);
        return location;
    } catch (error) {
        logger.error(`Not possible ${address} to be geolocated`, {error});
        throw Error(error);
    }
}

getWeather = async ({lat,lng}) =>{
    const url = `https://samples.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=b6907d289e10d714a6e88b30761fae22`;
    try { 
        const res = await axios.get(url);
        logger.info(`Weather received  for lat:${lat} lng:${lng}`);
        return res.data;
    } catch (error) {
        logger.error(`Not possible to get weather for lat:${lat} lng:${lng}`,{error});
        throw Error(error);
    }
}


module.exports = {getWeather, getLatLng}