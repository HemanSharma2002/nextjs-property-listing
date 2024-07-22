import { Property } from '@/model/PropertySchema'
import React, { useState } from 'react'
import { Label } from './ui/label'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from './ui/button'
import { MessageSquareIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'

type Props = {
    property: Property
}

export default function PropertyCard({ property }: Props) {
    const router = useRouter()
    const [sendingChat, setsendingChat] = useState(false)
    return (
        <main className=' border-2 border-slate-300 rounded-md w-[300px] md:w-[350px] h-[480px] flex flex-col gap-2 m-5 shadow-xl duration-700'>
            <Link href={`/properties/${property._id}`} className=' w-full h-[280px]  '>
                <img className=' h-full w-full object rounded-t-md  object-cover  ' src={property.images?.at(0) || ""} alt="" />
            </Link>

            <div className=' flex flex-col gap-4 m-2 text-lg'>
                <Label>
                    {property.title}
                </Label>
                <Label className=' flex flex-row gap-2' >
                    {property.bedrooms}
                    <p>BHK </p>
                    {property.type}
                </Label>

                <Label>
                    {property.address}
                </Label>
                <Label className=' flex flex-row gap-2'>
                    <p>Rs </p>
                    {property.price}
                    {property.propertyType === "rent" && <p> / month</p>}
                </Label>
                <div className=' flex flex-row justify-between px-10'>
                    <Button variant={"secondary"} disabled={sendingChat} onClick={() => router.push(`/properties/${property._id}`)}>View</Button>
                    <Button className=' flex flex-row gap-2' disabled={sendingChat} onClick={async () => {
                        try {
                            setsendingChat(true)
                            const result= await axios.post("/api/chats",{
                                property_id:property._id
                                , posted_by_id:property.posted_by._id
                            }).then(resp=>resp.data)
                            if(result.success){
                                router.push("/chats")
                            }
                            
                        } catch (error) {
                            console.log(error);
                            
                        }
                        finally {
                            setsendingChat(false)
                        }
                    }} variant={"secondary"}>Chat <MessageSquareIcon /></Button>
                </div>
            </div>
        </main>
    )
}