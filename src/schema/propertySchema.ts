import { features } from "process";
import { z } from "zod";

export const propertySchema = z.object(
    {
        title: z.string().min(1, "Field should not be empty").max(100,"Fild should contain less the 100 character"),
        description: z.string().min(1, "Field should not be empty").max(400,"Fild should contain less the 400 character"),
        price: z.string().min(1, "Field should not be empty").max(100,"Fild should contain less the 100 character"),
        type: z.string().min(1, "Field should not be empty").max(100,"Fild should contain less the 100 character"),
        images: z.array(z.string()).refine(values => values.some(item => item)),
        features: z.array(z.string()).refine(values => values.some(item => item)),
        bedrooms: z.string().min(1, "Field should not be empty").max(100,"Fild should contain less the 100 character"),
        bathrooms: z.string().min(1, "Field should not be empty").max(100,"Fild should contain less the 100 character"),
        size_sqft: z.string().min(1, "Field should not be empty").max(100,"Fild should contain less the 100 character"),
        location: z.string().min(1, "Field should not be empty").max(100,"Fild should contain less the 100 character"),
        properttype:z.string().min(1,"Should not be empty").max(100,"Fild should contain less the 100 character"),
        contact:z.string().length(10,"Mobile number should be of 10 character")
    }
)