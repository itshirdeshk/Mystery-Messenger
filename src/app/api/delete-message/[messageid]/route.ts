import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';
import UserModel from '@/models/User';
import mongoose from 'mongoose';

export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    await dbConnect();
    const messageId = params.messageid;
    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;


    if (!session || !session?.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }

    try {
        const updatedResult = await UserModel.updateOne({ _id: _user._id }, {
            $pull: {
                messages: { _id: messageId }
            }
        })

        if (updatedResult.modifiedCount == 0) {
            return Response.json({
                success: false,
                message: "Message not found!"
            }, { status: 404 })
        }

        return Response.json({
            success: true,
            message: "Message deleted successfully"
        }, { status: 200 })

    } catch (error) {
        console.error("Error while deleting the message", error);

        return Response.json({
            success: false,
            message: "An unexpected error occured!"
        }, { status: 500 })
    }
}