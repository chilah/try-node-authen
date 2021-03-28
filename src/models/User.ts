import { Document, Model, model, Schema } from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const UserSchemaFields = new Schema({
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

export interface IUser extends Document {
    email: string;
    password: string;
    tokens: string[];
}

export interface UserDocument extends IUser, Document {
    generateToken(): void;
}

interface UserModel extends Model<UserDocument> {
    findByAuthen(user: IUser): Promise<UserDocument>;
}

UserSchemaFields.methods.generateToken = function () {
    const user = this;
    const token = jwt.sign({ id: user._id.toString() }, 'tryn0d3');

    console.log(token);
};

UserSchemaFields.statics.findByAuthen = async function ({ email, password }: IUser) {
    console.log(email);
};

UserSchemaFields.pre<UserDocument>('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

const User = model<UserDocument>('User', UserSchemaFields);

export default User;
