import mongoose, { Document, Schema } from "mongoose"

export interface UserDocument extends User, Document {}

export interface User extends Document{
    email: string,
    password: string,
    name: string,
    phone?: string,
    image?:string,
    isVerified:string,
    verificationCode:string,
    verificationCodeExpiry:Date
    created_at: Date,
    updated_at: Date
}


export const UserSchema:Schema<User>=new Schema({
    email:{
        type:String,
        unique:true,
        required:true,
        match: [/.+\@.+\..+/, "Plese use a valid email address"]
    },
    password:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true
    },
    phone: {
        type:String,
    },
    image: {
        type:String,
    },
    isVerified:{
        type:String,
        required:true
    },
    verificationCode:{
        type:String,
        required:true
    },
    verificationCodeExpiry:{
        type:Date,
        required:true,
    },
    created_at: {
        type:Date,
        required:true,
        default:Date.now()
    },
    updated_at:{
        type:Date,
        required:true,
        default:Date.now()
    }

}) 
UserSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.isVerified;
    delete user.verificationCode;
    delete user.verificationCodeExpiry;
    delete user.created_at;
    delete user.updated_at;
    return user;
};
const UserModel=mongoose.models.User as mongoose.Model<User>||mongoose.model("User",UserSchema)
export default UserModel