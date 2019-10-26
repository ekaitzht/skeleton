const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const logger = require("./logger");
const Address = require("./repositories/address");

require("dotenv").config();

const { getWeather, getLatLng } = require("./utils");
const { check, validationResult } = require("express-validator");

const app = express();

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.post(
  "/validate",
  [
    check("street").exists(),
    check("streetNumber").exists(),
    check("town").exists(),
    check("postalCode").exists(),
    check("country").exists()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send({ valid: false, msg: "Invalid address", errors });
    }
    res.status(200).json({ valid: true, msg: "Valid address" });
  }
);

app.get("/geocoding", async (req, res) => {
  try {
    const data = await getLatLng(req.query.address); // refactor this more what not how
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send("Failing geocoding");
  }
});

app.get("/weather", async (req, res) => {
  try {
    if (!req.query.latlng) {
      const { address } = req.query;
      const url = `http://${process.env.HOSTNAME}:${process.env.PORT}/geocoding?address=${address}`;

      location = (await axios.get(url)).data;

      await Address.save({
        address,
        location
      });
    }
    logger.info("Getting weather for", location);
    const data = await getWeather(location);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error, msg: "Failing getting weather" });
  }
});

app.post("/validateandweather", async (req, res) => {
  try {
    const { data } = await axios.post(
      `http://${process.env.HOSTNAME}:${process.env.PORT}/validate`,
      req.body
    );

    if (data.valid) {
      const { street, streetNumber, town, postalCode, country } = req.body;
      const fullAddress = `${streetNumber} ${street},${town},${postalCode},${country}`;
      const { data } = await axios.get(
        `http://${process.env.HOSTNAME}:${process.env.PORT}/weather?address=${fullAddress}`
      );
      res.status(200).json(data);
    }
  } catch (error) {
    logger.error(error);
    res.send(error);
  }
});

app.listen(3000, function() {
  logger.info("Weather app started!");
});
