const mongoose = require('mongoose')

try {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true
    })
} catch (error) {
    console.log(error);
}

const dbConnection = mongoose.connection;
dbConnection.on("error", (err) => console.log(`Connection error ${err}`));
dbConnection.once("open", () => console.log("Connected to DB!"));