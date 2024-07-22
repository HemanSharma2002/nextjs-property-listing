"use client"
import Image from "next/image";
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from "@react-google-maps/api"
import { Skeleton } from "@/components/ui/skeleton"
const center = { lat: 28.7041, lng: 77.1025 }

export default function Home() {

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
    libraries: ['places']
  })
  if (!isLoaded) {
    return (
      <main className=" w-full h-[800px]">
        <Skeleton className="w-full h-full rounded-full" />

      </main>
    )
  }
  return (
    <main className=" w-full h-[800px]">
      {/* <GoogleMap center={center} zoom={15} mapContainerStyle={{width:"100%",height:"100%"}}
      options={{
        zoomControl:false,
        streetViewControl:false,
        mapTypeControl:false,
        fullscreenControl:false
      }}><Marker position={center}/>
      </GoogleMap> */}
      <Autocomplete>
        <input type="text" name="Location" placeholder="Location" />
      </Autocomplete>
    </main>
  );
}
