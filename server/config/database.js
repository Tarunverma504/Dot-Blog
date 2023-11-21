const mongoose = require('mongoose');

const connectDatabase = ()=>{
    mongoose.connect(process.env.DATABASE_URI,
        {useNewUrlParser: true, useUnifiedTopology: true}
        ).then(console.log("MongoDB Database Connected"));
}

module.exports = connectDatabase;