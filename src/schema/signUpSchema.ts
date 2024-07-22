import { z } from "zod";

export const signUpSchema=z.object({
    name:z.string().min(3,"Name must be more then 3 characters").max(30,"Name must not be more then 30 characters"),
    email:z.string().email("Enter a valid email address"),
    password:z.string().min(8,"Password must be more then 8 characters").max(20,"Password must not be more then 20 characters")
})