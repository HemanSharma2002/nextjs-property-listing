
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
import { toast } from "@/components/ui/use-toast"
import { propertyFilterSchema } from '@/schema/propertyFilterSchema'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { ScrollBar } from '@/components/ui/scroll-area'
import { Slider } from '@/components/ui/slider'
import { Building2Icon, House, HouseIcon } from 'lucide-react'
import axios from 'axios'
import PropertyCard from '@/components/PropertyCard'
import { Property } from '@/model/PropertySchema'
import Link from 'next/link'

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

const bedrooms = [
    {
        title: "1 RK/1 BHK",
        value: 1
    }
    , {
        title: "2 BHK",
        value: 2
    }, {
        title: "3 BHK",
        value: 3
    }, {
        title: "4 BHK",
        value: 4
    }, {
        title: "4+ BHK",
        value: 5
    }
]
export default function Properties({ }: Props) {
    const [loadProperties, setloadProperties] = useState(false)
    const [properties, setproperties] = useState<[Property]>()
    const form = useForm<z.infer<typeof propertyFilterSchema>>({
        resolver: zodResolver(propertyFilterSchema),
        defaultValues: {
            lookingFor: "buy",
            location: "",
            sort: "-1",
            budget1: "15000",
            budget2: "30000",
            propertyType: [],
            noOfBedrooms: []
        }
    })
    function onSubmit(value: z.infer<typeof propertyFilterSchema>) {
        setloadProperties(true)
        console.log(value);
        axios.put('/api/properties', {
            lat: "30.5937",
            lng: "75.9629",
            maxDistance: "5000",
            propertyType: value.propertyType,
            sort: value.sort==="1"?true:false,
            budget1: value.budget1,
            budget2: value.budget2,
            noOfBedrooms: value.noOfBedrooms,
            lookingFor:value.lookingFor

        }).then(resp => {
            const properties:[Property]=resp.data.properties
            setproperties(properties as [Property])
        })
            .catch(error => console.log(error))
            .finally(() => {
                setloadProperties(false)
            })
    }
    return (
        <main className=' w-full md:h-[100vh]'>
            <ScrollArea className=' h-full w-full flex md:flex-row flex-col  '>
                <ScrollArea className={` md:h-full md:w-1/3 md:overflow-y-auto py-6 ${properties?" hidden md:flex ":""}`}>
                    <div className=' flex md:flex-col h-full w-full   p-6'>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6 w-full">
                                <FormField
                                    control={form.control}
                                    name="lookingFor"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>Looking for</FormLabel>
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
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Location</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Location" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="budget1"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Budget</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Low" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="budget2"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormDescription className='mb-5 text-center'>
                                                to
                                            </FormDescription>
                                            <FormControl>
                                                <Input placeholder="High" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="propertyType"
                                    render={() => (
                                        <FormItem>
                                            <div className="mb-4">
                                                <FormLabel className="text-base">Properties</FormLabel>
                                                <FormDescription>
                                                    Select the Properties.
                                                </FormDescription>
                                            </div>
                                            {propertyTypes.map((item) => (
                                                <FormField
                                                    key={item}
                                                    control={form.control}
                                                    name="propertyType"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem
                                                                key={item}
                                                                className="flex flex-row items-start space-x-3 space-y-0"
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(item)}
                                                                        onCheckedChange={(checked) => {
                                                                            return checked
                                                                                ? field.onChange([...field.value, item])
                                                                                : field.onChange(
                                                                                    field.value?.filter(
                                                                                        (value) => value !== item
                                                                                    )
                                                                                )
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="text-sm font-normal">
                                                                    {item}
                                                                </FormLabel>
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            ))}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="noOfBedrooms"
                                    render={() => (
                                        <FormItem>
                                            <div className="mb-4">
                                                <FormLabel className="text-base">Bed Rooms</FormLabel>
                                                <FormDescription>
                                                    Select the Properties.
                                                </FormDescription>
                                            </div>
                                            {bedrooms.map((item) => (
                                                <FormField
                                                    key={item.title}
                                                    control={form.control}
                                                    name="noOfBedrooms"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem
                                                                key={item.title}
                                                                className="flex flex-row items-start space-x-3 space-y-0"
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(item.value)}
                                                                        onCheckedChange={(checked) => {
                                                                            return checked
                                                                                ? field.onChange([...field.value, item.value])
                                                                                : field.onChange(
                                                                                    field.value?.filter(
                                                                                        (value) => value !== item.value
                                                                                    )
                                                                                )
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="text-sm font-normal">
                                                                    {item.value}
                                                                </FormLabel>
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            ))}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="sort"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>Sort</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-col space-y-1"
                                                >
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="1" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            High to Low
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="-1" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            Low to High
                                                        </FormLabel>
                                                    </FormItem>

                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className=' w-full gap-4' variant={"secondary"} disabled={loadProperties}>See all properties <HouseIcon /></Button>
                            </form>
                        </Form>
                    </div>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
                <ScrollArea className=' md:h-full md:w-2/3 '>
                {
                    properties?
                    <div className=' flex flex-wrap justify-center md:gap-9 gap-3 md:p-5 md:overflow-y-auto h-full w-full'>
                        {
                            properties.map(
                                property=>(
                                    <div >
                                        <PropertyCard property={property}/>
                                    </div>
                                )
                            )
                        }
                    </div>
                    :
                    <div className=' md:flex hidden md:justify-center md:items-center md:h-screen'>
                        <Building2Icon/>Search for properties........
                    </div>
                }
                </ScrollArea>
                <ScrollBar orientation="vertical" />
            </ScrollArea>
        </main>
    )
}