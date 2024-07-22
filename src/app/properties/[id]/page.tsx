"use client"
import { Property } from '@/model/PropertySchema'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { IoCallOutline } from "react-icons/io5";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { FcApproval } from "react-icons/fc";
import { Loader2 } from 'lucide-react'
import PropertyCard from '@/components/PropertyCard'
import Image from 'next/image'

type Props = {}

export default function PropertiesId({ }: Props) {
  const [property, setproperty] = useState<Property>()
  const [moreProperties, setmoreProperties] = useState<Array<Property>>()
  const { id } = useParams()
  useEffect(loadPage, [id])
  function loadPage() {
    getData()
    async function getData() {
      try {
        const result = await axios.get("/api/properties/id", {
          params: {
            i: "",
            property_id: id
          }
        }).then(resp => resp.data)
        const property: Property = result.property
        setproperty(property)
        await axios.get('/api/properties', {
          params: {
            i: "i",
            lat: property.location.coordinates[1],
            lng: property.location.coordinates[0],
            maxDistance: 100
          }
        }).then(resp => {
          console.log(resp);

          const properties: [Property] = resp.data.properties
          setmoreProperties(properties as [Property])
        })
          .catch(error => console.log(error))
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <main className=' w-full  p-4 md:px-10'>
      {
        property ?
          <div className=' w-full'>
            <div className=' w-full flex md:flex-row flex-col gap-6'>
              <div>
                <div className=' w-full md:px-10'>
                  <Carousel plugins={[
                    Autoplay({
                      delay: 2000,
                    }),
                  ]}>
                    <CarouselContent>
                      {
                        property.images?.map(image => (
                          <CarouselItem className=' w-full h-[300px] md:h-[500px] rounded-md ' key={image}>
                            <Image src={image} alt="Image" className=' w-full rounded-md' />
                          </CarouselItem>
                        ))
                      }

                    </CarouselContent>
                    <CarouselPrevious className=' hidden md:flex' />
                    <CarouselNext className=' hidden md:flex' />
                  </Carousel>
                </div>
              </div>

              <div className=' flex flex-col gap-3'>
                <div>
                  <div className=' flex md:flex-row flex-col md:justify-between'>
                    <p className=' text-2xl'>{property.title}</p>
                    <div>
                      <p className='text-lg'>Seller</p>
                      <div className=' flex flex-row gap-3'>
                        <IoCallOutline className=' text-xl' />
                        <p>{property.contact}</p>
                      </div>
                      <p>{property.posted_by.name}</p>
                    </div>
                  </div>
                </div>
                <div className=' text-lg'>
                  For {property.propertyType.toUpperCase()}
                </div>
                <div className='md:text-lg flex flex-col gap-2'>
                  <p>{property.price}{property.propertyType === "rent" && " / Month"}</p>
                  <p>{property.address}</p>
                  <p>{property.description}</p>
                  <div className=' flex flex-col gap-2'>
                    <p>Features</p>
                    <div className='flex flex-col gap-2 text-sm '>
                      {
                        property.features?.map(f => (
                          <div className='flex flex-row gap-3 bg-green-200 p-2 rounded-md w-60 ' key={f}>
                            <FcApproval className='text-xl' />
                            <p>{f}</p>
                          </div>
                        ))
                      }
                    </div>
                  </div>

                </div>
                <div className=' md:text-lg flex flex-col gap-1'>
                  <p className=' text-xl'>Property Details</p>
                  <div className='flex flex-row md:gap-10 gap-3'>
                    <p>Type:</p>
                    <p>{property.type}</p>
                  </div>
                  <div className='flex flex-row md:gap-10 gap-3'>
                    <p>Bedrooms:</p>
                    <p>{property.bedrooms}</p>
                  </div>
                  <div className='flex flex-row md:gap-10 gap-3'>
                    <p>Bathrooms:</p>
                    <p>{property.bathrooms}</p>
                  </div>
                  <div className='flex flex-row md:gap-10 gap-3'>
                    <p>Area:</p>
                    <p>{property.size_sqft} sq.ft</p>
                  </div>
                  
                  <div className='flex flex-row md:gap-10 gap-3'>
                    <p>Seller:</p>
                    <p>{property.posted_by.name}</p>
                  </div>
                  <div className='flex flex-row md:gap-10 gap-3'>
                    <p>Seller number:</p>
                    <p>{property.contact}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className=' space-y-4'>
              <p className=' text-2xl font-bold'>More Properties</p>
              <div className=' flex flex-wrap gap-2 items-center justify-center w-full '>
                {
                  moreProperties?.map(property => (
                    <div key={property._id as string}>
                      <PropertyCard key={property._id as string} property={property} />
                    </div>
                  ))
                }
              </div>
            </div>

          </div> :
          <div className=' w-full h-full flex justify-center items-center'>
            <Loader2 className=' text-2xl animate-spin' />
          </div>
      }
    </main>
  )
}