const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db.js');
const cors = require('cors');


//routes
// const userRoutes = require('./routes/userRoutes.js');
const creatorRoutes = require('./routes/creatorRoute.js')
const videoRoutes = require('./routes/videoRoute.js')
const subscriberRoutes = require('./routes/subscriberRoute.js')

dotenv.config({ path: './.env' });


// db call
connectDB();



const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
// app.use('/api/v1/user', userRoutes);
app.use('/api/v1/creator', creatorRoutes)
app.use('/api/v1/video', videoRoutes)
app.use('/api/v1/subscriber', subscriberRoutes)


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
