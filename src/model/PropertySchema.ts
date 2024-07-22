import mongoose, { Document, Model, model, Schema } from "mongoose"
import { User, UserDocument } from "./UserSchema"

export interface PropertyDocument extends Property, Document { }

export interface Location {
    type: string,
    coordinates: [number, number]
}
export interface Property extends Document {
    title: string,
    description: string,
    type: string,
    propertyType: string,
    price: number,
    location: {
        type: string,
        coordinates: [number, number]
    },
    address: string,
    bedrooms: number,
    bathrooms: number,
    size_sqft: number,
    features?: Array<string>,
    images?: Array<string>,
    posted_by: UserDocument["_id"] & User,
    sold: boolean,
    created_at: Date,
    updated_at: Date,
    contact:string
}

const PropertySchema: Schema<Property> = new Schema({
    title:
    {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    propertyType: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    address: {
        type: String,
        required: true
    },
    bedrooms: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    size_sqft: {
        type: Number,
        required: true
    },
    features:
        [
            {
                type: String
            }
        ],
    images: [
        {
            type: String
        }
    ],
    posted_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sold: {
        type: Boolean,
        required: true,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now()
    },
    contact:{
        type: String,
        required:true
    }
});
// Create a 2dsphere index on location
PropertySchema.index({ location: '2dsphere' });
const PropertyModel = mongoose.models.Property as mongoose.Model<Property> || mongoose.model("Property", PropertySchema)
export default PropertyModel;