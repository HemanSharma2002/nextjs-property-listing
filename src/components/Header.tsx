"use client"
import { signOut, useSession } from 'next-auth/react'
import React from 'react'
import { Label } from './ui/label'
import Link from 'next/link'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { Avatar } from './ui/avatar'
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Menu } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

type Props = {}

export default function Header({ }: Props) {
    const { data: session } = useSession()
    const router = useRouter()
    return (
        <div className=' flex flex-row justify-between p-5 md:px-10'>
            <div>
                <p className=' text-xl font-bold'>Property Listing</p>
            </div>
            <div className='  flex-col hidden md:flex'>
                <ul className=' flex flex-row gap-5'>
                    <li><Link href={`/`}>Home</Link></li>
                    <li><Link href={`/properties`}>Properties</Link></li>
                    <li><Link href={`/properties/list/property`}>List Online</Link></li>
                    <li><Link href={`/about`}>About</Link></li>
                </ul>
                
            </div>
            <Sheet >
                <SheetTrigger> <Menu className=' text-xl md:hidden' /></SheetTrigger>
                <SheetContent className=' md:hidden'>
                    <SheetHeader>
                        
                        <SheetDescription className='flex flex-col gap-5'>
                            <ul className=' flex flex-col gap-5'>
                                <li><Link href={`/`}>Home</Link></li>
                                <li><Link href={`/properties`}>Properties</Link></li>
                                <li><Link href={`/properties/list/property`}>List Online</Link></li>
                                <li><Link href={`/about`}>About</Link></li>
                            </ul>
                            {
                                session ?
                                    <Label className='md:hidden'>
                                        <Label className='  space-y-5'>
                                            <button className=' gap-3 '>
                                                <p>{session.user?.name}</p>
                                                <Link className='#' href={"/sign-in"}>
                                                    <Avatar>
                                                        <AvatarImage src={session.user?.image || "https://github.com/shadcn.png"} />
                                                        <AvatarFallback>CN</AvatarFallback>
                                                    </Avatar>
                                                </Link></button>
                                            <hr />
                                            <button onClick={() => {
                                                signOut()
                                                router.push(`/sign-out`)
                                            }} >Sign Out</button>
                                        </Label>
                                    </Label>
                                    :
                                    <div>
                                        <Label className=' space-y-5 '>
                                            <Link href={"/sign-in"}>Sign In</Link>
                                            <hr />
                                            <Link href={"/sign-up"}>Create new account</Link>
                                        </Label>
                                    </div>

                            }
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>

            <div className='hidden md:flex'>
                {
                    session ?
                        <div className=' '>
                            <Label className=' flex flex-row gap-3 text-lg'>
                                <button className=' gap-3 '>
                                    <p>{session.user?.name}</p>
                                    <Link className='#' href={"/sign-in"}>
                                        <Avatar>
                                            <AvatarImage src={session.user?.image || "https://github.com/shadcn.png"} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </Link></button>
                                <p className='pt-2'>|</p>
                                <button onClick={() => {
                                    signOut()
                                    router.push(`/sign-out`)
                                }} >Sign Out</button>
                            </Label>
                        </div>
                        :
                        <div>
                            <Label className=' flex flex-row gap-3'>
                                <Link href={"/sign-in"}>Sign In</Link>
                                <p >|</p>
                                <Link href={"/sign-up"}>Create new account</Link>
                            </Label>
                        </div>

                }
            </div>
        </div>
    )
}