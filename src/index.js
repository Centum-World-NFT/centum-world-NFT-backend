const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db.js');
const cors = require('cors');


//routes

const creatorRoute = require('./routes/creatorRoute.js')
const videoRoute = require('./routes/videoRoute.js')
const subscriberRoute = require('./routes/subscriberRoute.js')
const userRoute = require('./routes/userRoute.js')

dotenv.config({ path: './.env' });


// db call
connectDB();



const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/user', userRoute);
app.use('/api/v1/creator', creatorRoute)
app.use('/api/v1/video', videoRoute)
app.use('/api/v1/subscriber', subscriberRoute)


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
