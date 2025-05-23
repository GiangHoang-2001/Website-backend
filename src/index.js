const express = require("express");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const routes = require('./routes');
const cors = require('cors');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
dotenv.config()

const app = express()
const port = process.env.PORT || 3001

const allowedOrigins = ['http://localhost:3000', 'https://websiteshopmall.vercel.app'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json())
app.use(cookieParser())


routes(app);

mongoose.connect(`${process.env.MONGO_DB}`)
    .then(() => {
        // console.log('Connect Db success!')
    })
    .catch((err) => {
        // console.log(err)
    })

app.listen(port, () => {
    // console.log('Server is running in port: ', + port)
})