import { Document, Model, model, Schema, deleteModel, LeanDocument } from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const UserSchemaFields = new Schema<UserDocument, UserModel>({
    firstname: {
        type: String,
        trim: true,
    },
    lastname: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value: string) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
});

export interface IUser {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    tokens: { token: string }[];
}

export interface UserDocument extends IUser, Document {
    generateToken(): Promise<string>;
}

interface UserModel extends Model<UserDocument> {
    findByAuthen(user: IUser): Promise<UserDocument>;
}

UserSchemaFields.methods.generateToken = async function () {
    const user = this;
    const token = jwt.sign({ id: user._id.toString() }, 'tryn0d3');

    user.tokens = [...user.tokens, { token }];
    await user.save();

    return token;
};

UserSchemaFields.statics.findByAuthen = async ({ email, password }: IUser) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to login');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) throw new Error('Unable to login');

    return user;
};

UserSchemaFields.pre<UserDocument>('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

const User = model<UserDocument, UserModel>('User', UserSchemaFields);

export default User;
