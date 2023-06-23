const mongoose = require("mongoose");
// const mongoURI = "mongodb+srv://srishty:sw841238@cluster0.gxrvwow.mongodb.net/mongodb://localhost:27017/inotebook?"

const connectDB = async () => {
  try {
    // Connect to the MongoDB cluster
    console.log(1);
    const conn = await mongoose.connect(
      "mongodb+srv://srishty:sw841238@cluster0.gxrvwow.mongodb.net/inotebook?",
      {
        // userNewUrlParser: true,
      }
    );
    console.log(2);
    console.log(`MongoDB connected:${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
