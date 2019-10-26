const Address = require("../models/address");
const logger = require("../logger");

module.exports = {
  save: async address => {
    var addressModel = new Address(address);
    try {
      logger.info("Saving address", address);
      const res = await addressModel.save();
    } catch (error) {
      logger.error("Error saving address", error);
    }
  }
};
