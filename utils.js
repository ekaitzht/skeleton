const axios = require('axios');

getLatLng = async (address) =>{
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.API_KEY}`;
    try { 
        const { results } = (await axios.get(url)).data;
        const { location } = results.pop().geometry;
        return location;
    } catch (error) {
        throw Error(error);
    }
}

getWeather = async ({lat,lng}) =>{
    const url = `https://samples.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=b6907d289e10d714a6e88b30761fae22`;
    try { 
        const res = await axios.get(url);
        return res.data;
    } catch (error) {
        throw Error(error);
    }
}


module.exports = {getWeather, getLatLng}