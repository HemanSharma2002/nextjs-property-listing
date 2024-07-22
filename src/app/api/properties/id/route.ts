import dbConnect from "@/lib/dbConnect"
import { auth } from "../../auth/[...nextauth]/auth"
import { NextRequest } from "next/server"
import PropertyModel from "@/model/PropertySchema"

export async function GET(req: NextRequest) {
    try {
        await dbConnect()
        const url=req.url
        const searchParam=new URLSearchParams(url)
        console.log(searchParam.get("property_id"));
        const property=await PropertyModel.findById(searchParam.get("property_id")).populate("posted_by")
        return Response.json({
            success: true,
            message: "Property",
            property
        }, {
            status: 200
        })
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