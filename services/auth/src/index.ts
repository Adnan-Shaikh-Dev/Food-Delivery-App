import express, { json } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoute from './routes/auth.js'
import cors from 'cors'

dotenv.config({path:'./.env'})

const app = express()

const PORT = process.env.PORT || 5000;
app.use(cors())
app.use(express.json());
app.use("/api/auth", authRoute)


app.listen(PORT, ()=>{
    console.log(`App running at port: ${PORT}`)
    connectDB()
})