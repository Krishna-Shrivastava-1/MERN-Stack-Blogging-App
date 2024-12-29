import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bodyparser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import Authroutes, { verifytoken } from './Routes/Authroutes.js'
import Articleroutes from './Routes/Articleroutes.js'
const app = express()
dotenv.config()
const port = process.env.PORT || 3000


// Middlewares
app.use(bodyparser.json())
app.use(express.json())
app.use(cors({
    origin: '*',
    Credential: true,
    Headers: ['Content-Type', 'Authorization']
}))
app.use(cookieParser())

// Connecting to Database
mongoose.connect(process.env.MONGODBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Database Connected')).catch((err) => console.log(err))

// Api Connection
app.use('/auth',Authroutes)
app.use('/article',Articleroutes)

// connecting to server
app.listen(port, () => {
    console.log(`Server is listing on port ${port}`)
})