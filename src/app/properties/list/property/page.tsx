"use client"
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast, useToast } from "@/components/ui/use-toast"
import { propertyFilterSchema } from '@/schema/propertyFilterSchema'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { ScrollBar } from '@/components/ui/scroll-area'
import { Slider } from '@/components/ui/slider'
import { Building2Icon, Cross, CrossIcon, House, HouseIcon, X } from 'lucide-react'
import { propertySchema } from '@/schema/propertySchema'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import Image from 'next/image'

type Props = {}

const propertyTypes = [
    "Residential Appartment",
    "Indemendent House/Villa",
    "Plot / Land",
    "Builder Floor",
    "Farm House",
    "Serviced Apartment",
    "1 RK/Studio Appartment"
] as const

export default function ListProperty({ }: Props) {
    const [savingProperty, setsavingProperty] = useState(false)
    const [feature, setfeature] = useState("")
    const [image, setimage] = useState("")
    const {toast}=useToast()
    const form = useForm<z.infer<typeof propertySchema>>({
        resolver: zodResolver(propertySchema),
        defaultValues: {
            title: "",
            description: "",
            price: "",
            type: "Residential Appartment",
            location: "",
            images: [],
            bedrooms: "",
            bathrooms: "",
            size_sqft: "",
            features: [],
            properttype: "buy",
            contact:""
        }
    })
    async function onSubmit(value: z.infer<typeof propertySchema>) {
        try {
            const object = {
                title:value.title,
                description:value.description,
                price:value.price,
                type:value.type,
                location:value.location,
                latitude:31.4685,
                longitude:76.2708,
                images:value.images,
                bedrooms:Number(value.bathrooms),
                bathrooms:Number(value.bathrooms),
                size_sqft:Number(value.size_sqft),
                feature:value.features,
                propertyType:value.properttype,
                contact:value.contact
            }
            const result = await axios.post(`/api/properties`,object).then(resp => resp.data)
            console.log(result);
            
            if(result.data.success){
                toast({
                    description:"Property is saved"
                })
            }
            else{
                toast({
                    description:"Failed to save property",
                    variant:"destructive"
                })
            }
            
        } catch (error) {
            console.log(error);
            
            toast({
                description:"Error",
                variant:"destructive"
            })
        }
    }
    return (
        <main>
            <ScrollArea className=' p-10'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6 w-full">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder='Description'  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Price'  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="properttype"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>You want to sell/ rent </FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="buy" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Buy
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="rent" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Rent
                                                </FormLabel>
                                            </FormItem>

                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Propery type</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            {
                                                propertyTypes.map(item => (
                                                    <FormItem className="flex items-center space-x-3 space-y-0" key={item}>
                                                        <FormControl>
                                                            <RadioGroupItem value={item} />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            {item}
                                                        </FormLabel>
                                                    </FormItem>
                                                ))
                                            }

                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Location'  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="features"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Feature</FormLabel>
                                    <div className=' w-full min-h-10 rounded-md border-2 p-2 border-slate-200 flex flex-wrap gap-3 '>
                                        {
                                            field.value.map(f => (
                                                <Label id={f} className=' flex flex-row gap-3 text-white bg-slate-950  p-1 px-2 rounded-md' key={f}>
                                                    <p className=' pt-1'>{f}</p>
                                                    <X onClick={() => {
                                                        field.onChange(
                                                            field.value?.filter(
                                                                (value) => value !== f
                                                            )
                                                        )
                                                    }} />
                                                </Label>
                                            ))
                                        }
                                    </div>
                                    <FormControl>
                                        <div className='flex flex-col gap-3'>
                                            <Input placeholder='Feature' value={feature} onChange={e => setfeature(e.target.value)} />
                                            <Button variant={"secondary"} onClick={(e) => {

                                                e.preventDefault()
                                                if (feature === "")
                                                    return
                                                field.onChange([...field.value, feature])
                                                setfeature("")
                                            }}>Add Feature</Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="images"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Images</FormLabel>
                                    <div className=' w-full min-h-10 rounded-md border-2 p-2 border-slate-200 flex flex-wrap gap-3 '>
                                        {
                                            field.value.map(f => (
                                                <Label id={f} className=' flex flex-row gap-3 text-white bg-slate-950 w-60 h-60 relative   rounded-md' key={f}>
                                                    <Image src={f} className=' w-full h-full object object-full rounded-md' alt="" />
                                                    <X className=' absolute z-10 right-3 top-3 text-black' onClick={() => {
                                                        field.onChange(
                                                            field.value?.filter(
                                                                (value) => value !== f
                                                            )
                                                        )
                                                    }} />
                                                </Label>
                                            ))
                                        }
                                    </div>
                                    <FormControl>
                                        <div className='flex flex-col gap-3'>
                                            <Input placeholder='Image' value={image} onChange={e => setimage(e.target.value)} />
                                            <Button variant={"secondary"} onClick={(e) => {

                                                e.preventDefault()
                                                if (image === "")
                                                    return
                                                field.onChange([...field.value, image])
                                                setimage("")
                                            }}>Add Image</Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bedrooms"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>BedRooms</FormLabel>
                                    <FormControl>
                                        <Input placeholder='BedRooms'  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bathrooms"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bathrooms</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Bathrooms'  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="size_sqft"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Square ft size</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Square ft size'  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contact"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Contact'  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className=' w-full gap-4' variant={"secondary"} disabled={savingProperty}>List property online <HouseIcon /></Button>
                    </form>
                </Form>
            </ScrollArea>
        </main>
    )
}