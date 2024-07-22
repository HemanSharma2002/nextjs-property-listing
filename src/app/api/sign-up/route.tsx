import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserSchema";
import "bcryptjs"

export async function POST(req: Request) {
    try {
        dbConnect()
        const { email, password, name } = await req.json()
        const existingUser = await UserModel.findOne(
            {
                email
            }
        )
        const bcrypt = await require('bcryptjs');
        const hashpassword = await bcrypt.hash(password, 10)
        if (existingUser) {
            if (existingUser.isVerified) {
                return Response.json({
                    success: false,
                    message: "User exist . Please login"
                }, {
                    status: 200
                })
            }
            await UserModel.findByIdAndUpdate(existingUser._id,{
                password,
                verificationCode:"564564",
                verificationCodeExpiry: new Date(Date.now() + (2 * 60 * 60 * 1000))
            })
            //send otp to email
            return Response.json({
                success: false,
                message: "User exist but not verified."
            }, {
                status: 200
            })
        }
        const user = new UserModel({
            name,
            email,
            password: hashpassword,
            verificationCode: "123456",
            verificationCodeExpiry: new Date(Date.now() + (2 * 60 * 60 * 1000)),
            isVerified:true
        })
        await user.save()
        //send otp to email code
        return Response.json({
            success: true,
            message: "User saved.Verify using otp"
        }, {
            status: 201
        })

    } catch (error) {
        console.error(error)
        return Response.json({
            success: false,
            message: "Server Error"
        }, {
            status: 500
        })
    }
}