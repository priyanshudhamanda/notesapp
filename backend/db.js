const mongoose = require("mongoose");

async function mongo_connection() {
  await mongoose.connect("mongodb://localhost:27017/test", () => {
    console.log("connected to mongo....!!");
  });
}

module.exports = mongo_connection;
