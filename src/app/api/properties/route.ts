import UserModel from "@/model/UserSchema"
import { auth } from "../auth/[...nextauth]/auth"
import PropertyModel from "@/model/PropertySchema"
import dbConnect from "@/lib/dbConnect"
import { useParams, useSearchParams } from "next/navigation"
import { log } from "console"
import { url } from "inspector"


export async function POST(req: Request) {
    const sesion = await auth()
    if (!sesion) {
        return Response.json({
            success: false,
            message: "UNAUTHORIZED"
        }, {
            status: 401
        })
    }
    try {
        dbConnect()
        const { title, description, price, type, location, latitude, longitude, images, bedrooms, bathrooms, size_sqft, feature, propertyType,contact } = await req.json()
        const user = await UserModel.findOne(
            { email: sesion.user?.email }
        )
        console.log(propertyType);

        const property = new PropertyModel(
            {
                title,
                description,
                type,
                price,
                location: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                },
                address: location,
                bedrooms,
                bathrooms,
                size_sqft,
                features: feature || [],
                images: images || [],
                posted_by: user?._id,
                propertyType,
                contact
            }
        )

        await property.save()
        return Response.json(
            {
                success: true,
                message: "Propert is listed online"
            },
            {
                status: 201
            }
        )
    } catch (error) {
        console.error(error)
        return Response.json({
            success: false,
            message: "Server Error"
        }, {
            status: 500
        })
    }
}

export async function PUT(req: Request) {
    await dbConnect()
    try {
        const {lat,lng,maxDistance,propertyType,sort,budget1,budget2,noOfBedrooms,lookingFor}=await req.json()
        
        if (lat && lng && maxDistance) {
            console.log(lookingFor,propertyType,budget1,budget2,noOfBedrooms,sort);
            
            const properties = await PropertyModel.aggregate
            (
                [
                    {
                        $match: {
                            location: {
                                $geoWithin: {
                                    $centerSphere: [[parseFloat(lng as string), parseFloat(lat as string)], parseFloat(maxDistance as string) / 6378.1]
                                }
                            },
                            propertyType: lookingFor as string,
                            type: {
                                $in: propertyType as [string]
                            },
                            price: {
                                $gte: Number(budget1) as number, $lte: Number(budget2) as number
                            },
                            bedrooms: {
                                $in: noOfBedrooms as [number]
                            }

                        }
                    }, {
                        $lookup: {
                            from: "users",
                            localField: "posted_by",
                            foreignField: "_id",
                            as: "posted_by"
                        }
                    }
                    ,
                    {
                        $sort: {
                          prize: sort?1:-1
                        }}
                ]
            )
            console.log(properties,1)
            return Response.json({
                success: true,
                message: "List of properties",
                properties
            }, {
                status: 200
            })
        } else {
            const properties = await PropertyModel.find().populate('posted_by');
            return Response.json({
                success: true,
                message: "List of properties",
                properties
            }, {
                status: 200
            });
        }
    } catch (error) {
        console.error(error)
        return Response.json({
            success: false,
            message: "Server Error"
        }, {
            status: 500
        })
    }
}

export async function GET(req: Request) {
    await dbConnect()
    try {
        const searchUrl=new URLSearchParams(req.url)
        console.log(searchUrl.get("lat"),searchUrl.get("lng"),searchUrl.get("maxDistance"));
        const lat=searchUrl.get("lat");
        const lng=searchUrl.get("lng");
        const maxDistance=searchUrl.get("maxDistance")
        
        if (lat && lng && maxDistance) {
            const properties = await PropertyModel.aggregate
            (
                [
                    {
                        $match: {
                            location: {
                                $geoWithin: {
                                    $centerSphere: [[parseFloat(lng as string), parseFloat(lat as string)], parseFloat(maxDistance as string) / 6378.1]
                                }
                            },
                            sold:false
                        }
                    }, {
                        $lookup: {
                            from: "users",
                            localField: "posted_by",
                            foreignField: "_id",
                            as: "posted_by"
                        }
                    },{
                        $limit:21
                    }
                    
                ]
            )
            return Response.json({
                success: true,
                message: "List of properties",
                properties
            }, {
                status: 200
            })
        } else {
            const properties = await PropertyModel.find().populate('posted_by');
            return Response.json({
                success: true,
                message: "List of properties",
                properties
            }, {
                status: 200
            });
        }
    } catch (error) {
        console.error(error)
        return Response.json({
            success: false,
            message: "Server Error"
        }, {
            status: 500
        })
    }
}