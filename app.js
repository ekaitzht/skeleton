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

app.get("/weather", async (req, res) => {
  const { address } = req.query;
  logger.info("Getting weather", address);
  try {
    const location = await getLatLng(address);
    const data = await getWeather(location); // refactor this more what not how
    await Address.save({
      address,
      location
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send("Failing getting weather");
  }
});

app.post("/validateandweather", async (req, res) => {
  try {
    const { data } = await axios.post(
      `http://${process.env.HOSTNAME}:${process.env.PORT}/validate`,
      req.body
    );
    console.log("#######", data.valid);

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
