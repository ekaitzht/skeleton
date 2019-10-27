const MongoClient = require("mongodb").MongoClient;

console.log("Connecting ");
const client = new MongoClient("mongodb://mongodb:27017/wefox");
setTimeout(() => {
  client.connect(err => {
    const collection = client
      .db("wefox")
      .collection("addresses")
      .find();
    // perform actions on the collection object
    console.log("collectiton", collection);
  });

  setInterval(() => {
    const collection = client
      .db("wefox")
      .collection("addresses")
      .find();
    // perform actions on the collection object
    console.log("collectiton", collection);
  }, 3000);
}, 3000);
