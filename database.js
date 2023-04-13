const {connect} = require("mongoose");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const MONGODB_URI = process.env.MONGODB_URI;
connect(MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,

    }
).then(db => console.log('Database conectada')).catch(err => console.log(err));
