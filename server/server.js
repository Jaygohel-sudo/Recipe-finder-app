import express from 'express';
import cors from 'cors'
import bcrypt from 'bcryptjs';
import {v4 as uuidv4} from 'uuid'
import { connectDB } from './db/connectDB.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000
 
app.use(cors({origin:"http://localhost:5173", credentials:true}));
app.use(express.json())
app.use(cookieParser())


app.listen(PORT,()=>{
    connectDB()
    console.log('server is running on', PORT)
})
app.use('/api/auth', authRoutes)


//DZYWdKSU4B8qkFpE