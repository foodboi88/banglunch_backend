import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose, { Document, Model } from "mongoose";
import { FailedResponseType, failedResponse } from "../../utils/http";
import { IUser, IUserProfile, IUserResponse } from "./users.types";



export interface UserDocument extends IUser, Document { };
export interface UserProfileDocument extends IUserProfile, Document { };
interface UserModel extends Model<UserDocument> {
    checkLogin: (email: string, password: string) => UserDocument | undefined | FailedResponseType<string>
    generateAccessToken: (user: any, remember?: boolean) => string
    generateRefreshToken: (user: any) => string
    getUserProfile: (token: string) => any
    updateProfile: (token: string) => any
    getResetPasswordToken: (email: string) => any
    getIdFromToken: (token: string) => any
    comparePassword: (email: string, password: string) => boolean
}

const userSchema = new mongoose.Schema<UserDocument, UserModel>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    dob: {
        type: Date,
    },
    gender: {
        type: Boolean,
    },
    role: {
        type: String,
        required: true,
    },
});

userSchema.pre<UserDocument>('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

userSchema.methods.toJSON = function (): Omit<IUserResponse, 'accessToken'> {
    const user = this;
    return {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        dob: user.dob,
        gender: user.gender,
        role: user.role
    }
};

userSchema.statics.generateAccessToken = function (user: UserDocument, remember = false): string {
    const { id } = user;
    return jwt.sign({ id }, 'dqPyPxJnDS4e2iU0815m', { expiresIn: remember ? '3d' : '2h' });
};

userSchema.statics.generateRefreshToken = function (user: UserDocument): string {
    const { id } = user;
    return jwt.sign({ id }, 'DQpYpXjNds4E2Iu0815M', { expiresIn: '4d' });
};

userSchema.statics.checkLogin = async function (email: string, password: string): Promise<UserDocument | undefined | FailedResponseType<string>> {
    const user = await Users.findOne({ email });

    if (!user) {
        return failedResponse('Sai tài khoản hoặc mật khẩu', 'WrongCredentials');
    }

    const isValidPassword = await bcrypt.compare(password, user?.password);

    if (!isValidPassword) {
        return failedResponse('Sai tài khoản hoặc mật khẩu', 'WrongCredentials');
    }
    return user;
};

userSchema.statics.getUserProfile = async function (token: string): Promise<any> {
    const { email } = jwt.verify(token, 'dqPyPxJnDS4e2iU0815m') as { email: string };
    const userProfile = await Users.findOne({ email });


    if (!userProfile) {
        return failedResponse('Không tìm thấy tài khoản', 'UserNotFound');
    }

    return userProfile
}

//update profile
userSchema.statics.updateProfile = async function (token: string): Promise<any> {
    const { email } = jwt.verify(token, 'dqPyPxJnDS4e2iU0815m') as { email: string };
    const userProfile = await Users.findOne({ email })
    if (!userProfile) {
        return failedResponse('Không tìm thấy tài khoản', 'UserNotFound');
    }
    return userProfile
}

//get id from token
userSchema.statics.getIdFromToken = async function (token: string): Promise<any> {
    const { id } = jwt.verify(token, 'dqPyPxJnDS4e2iU0815m') as { id: string };

    return id
}

//compare password
userSchema.statics.comparePassword = async function (email: string, password: string): Promise<boolean> {
    const userProfile = await Users.findOne({ email })
    if (!userProfile) {
        return false
    }
    //compare password bcrypt.hash(user.password, 8);

    const isValidPassword = await bcrypt.compare(password, userProfile.password);
    const newPassword = await bcrypt.hash(password, 8);

    if (!isValidPassword) {
        return false
    }
    return true
}

const Users = mongoose.model<UserDocument, UserModel>('users', userSchema);

export default Users;