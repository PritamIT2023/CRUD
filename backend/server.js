import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(express.json());
import authRoutes from './auth/auth.router.js';
import categoryRoutes from './category/category.router.js';
import serviceRoutes from './services/servise.router.js';
import { authenticate } from './middleware/auth.middleware.js';

app.use('/auth',authRoutes);
app.use('',authenticate, categoryRoutes);
app.use('',authenticate, serviceRoutes);

app.get('/',(req,res)=>{
    res.send("Hello World");
})

app.listen(8080,()=>{
    console.log("server is running");
})