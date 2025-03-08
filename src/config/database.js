const mongoose = require("mongoose");


const connectDB = async () =>{
    await mongoose.connect(
        "mongodb+srv://priyanshiparmar1904:3mvjGHwsCR3EmHv4@namastenode.dcoca.mongodb.net/devTinder"
      );
}

module.exports = {connectDB};


