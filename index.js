const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./src/config/db.js');
const cors = require('cors');


//routes

const creatorRoute = require('./src/routes/creatorRoute.js')
const videoRoute = require('./src/routes/videoRoute.js')
const subscriberRoute = require('./src/routes/subscriberRoute.js')
const userRoute = require('./src/routes/userRoute.js')
const adminRoute = require('./src/routes/adminRoute.js')
const paymentRoute = require('./src/routes/paymentRoute.js')
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
app.use('/api/v1/admin',adminRoute)
app.use('/api/v1/payment',paymentRoute)





const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
