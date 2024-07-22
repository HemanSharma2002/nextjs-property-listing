"use client"
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signInSchema } from '@/schema/signInSchema'
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
import { Input } from "@/components/ui/input"
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'
import { Lock } from 'lucide-react'
import { signUpSchema } from '@/schema/signUpSchema'
import axios from "axios"

type Props = {}

export default function SiginUp({ }: Props) {
  const [signInLoading, setsignInLoading] = useState(false)
  const [showPassword, setshowPassword] = useState(false)
  const { data: session } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  if (session) {
    router.push("/")
  }
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name:"",
      email: "",
      password: ""
    },
  })
  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    console.log(values);
    try {
      setsignInLoading(true)
      const result = await axios.post(`/api/sign-up`,values).then(resp=>resp)
      if (result.data) {
        if (result.data.success) {
          toast({
            title: 'Sign In successfull',
            description: 'Email password is saved , Please verify',
          });
          router.push('/verify')
        } else {
          toast({
            title: 'Sign Up failed',
            description: result.data.message,
            variant: 'destructive',
          });
        }
        return
      }
      router.push("/")
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        variant: 'destructive',
      });
      
    } finally {
      setsignInLoading(false)
    }
  }
  return (
    <main className=' w-full min-h-[100vh] md:flex md:flex-row md:justify-center'>
      <div className=' flex flex-col gap-8 py-6 px-2 w-full md:mt-14 md:w-1/3 ' >
        <div className='text-2xl text center w-full flex flex-col items-center gap-2'>
          <Lock className='w-10 h-10' />
          <Label className='text-2xl'>Sign Up</Label>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 w-full">
          <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type={showPassword ? "text" : "password"} {...field} />

                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Checkbox disabled={signInLoading} onClick={() => setshowPassword(!showPassword)} />
              <Label htmlFor=""> Show password</Label>
            </div>
            <Button type="submit" variant={"secondary"} disabled={signInLoading}>Sign In</Button>
          </form>
        </Form>
        <Separator />
        <Button type="submit" variant={"secondary"} disabled={signInLoading} onClick={() => {
          try {
            setsignInLoading(true)
            signIn("google")
            router.push("/")
          } catch (error) {
            console.log(error);

          } finally {
            setsignInLoading(false)
          }
        }
        }>Google</Button>
        <Label className=' flex flex-row gap-2 text-sm'>
          <Link href={`/sign-in`} className='hover:underline'>Sign in</Link>
           Aready a user
        </Label>
      </div>
    </main>
  )
}