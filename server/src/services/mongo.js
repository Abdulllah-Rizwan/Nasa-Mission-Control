import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open',()=>{
    console.log("Alhumdullillah Connection successful");
});

mongoose.connection.once('error',(err)=>{
    console.error(err);
});

export async function mongoConnect(){
    await mongoose.connect(MONGO_URL);
};

export async function mongoDisconnect(){
    await mongoose.disconnect();
};