import mongoose from "mongoose";


type ConnectionObject={
    isConnected?:number
}
const connection:ConnectionObject={}
async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("Already connected");
        return
    }
    try {
        const db =await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://springstoreindia:Ap4h7ZfFU6mx4mXd@cluster0.fnvklla.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        connection.isConnected=db.connections[0].readyState
        console.log("DB connected");
        return
    } catch (error) {
        console.log("DB connection failed ",error);
        process.exit(1)
    }
}
export default dbConnect;