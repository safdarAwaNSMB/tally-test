const mongoose = require('mongoose')

// * This is the mongodb Atlas connection link

const dbConnect = 'mongodb+srv://safdarstudent:abc123ABC@my-cluster.hmc2ddc.mongodb.net/tally-Up';

 

    // * This is the mongodb Atlas connection

    mongoose.connect(dbConnect).then(() => {

        console.log('Hurrah! MongoDB connection successfully established :)');

    }).catch((err) => {

        console.log('Sorry Bro! MongoDB is not connected :(', err);

    })
