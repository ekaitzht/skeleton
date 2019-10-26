const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.connect(`mongodb://localhost:${process.env.MONGODB_PORT}/wefox`, {
  useNewUrlParser: true
});

const AddressSchema = new Schema({
  address: String,
  location: {
    type: [Number],
    index: "2d"
  }
});

module.exports = mongoose.model("Address", AddressSchema);
