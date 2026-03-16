import mongoose from 'mongoose';

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL as string, {
            dbName:"Food-Delivery-App",
        })

        console.log('Connected to MongoDb successfully')
    }catch(error){
        console.log(error)
    }
}

export default connectDB