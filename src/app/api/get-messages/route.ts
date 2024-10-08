import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';
import UserModel from '@/models/User';
import mongoose from 'mongoose';

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;


    if (!session || !session?.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }

    const userId = new mongoose.Types.ObjectId(_user._id);

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },
        ]).exec();

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        const messages = user.length === 0 ? [] : user[0].messages;

        return Response.json({
            success: true,
            messages
        }, { status: 200 })
    } catch (error) {
        console.error("An unexpected error occured!", error);

        return Response.json({
            success: false,
            message: "An unexpected error occured!"
        }, { status: 500 })
    }
}