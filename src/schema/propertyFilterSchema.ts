import { z } from "zod";

export const propertyFilterSchema=z.object({
    lookingFor:z.string().min(1,"Should not be empty"),
    sort:z.string().min(1,"Should not be empty"),
    location:z.string().min(1,"Should not be empty"),
    propertyType:z.array(z.string()).refine(values=>values.some(item=>item)),
    noOfBedrooms:z.array(z.number()).refine(values=>values.some(item=>item)),
    budget1:z.string().min(1,"Should not be empty"),
    budget2:z.string().min(1,"Should not be empty"),
   
})