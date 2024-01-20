import mongoose, {InferSchemaType} from "mongoose";
import {ENTITY_TYPES_ALL, USER} from "../types/entityTypes";

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String
    },
    otpExpire: {
        type: Date
    },
    entityType: {
        type: String,
        default: USER,
        enum: ENTITY_TYPES_ALL,
        immutable: true
    }
}, {
    timestamps: true
});

type User = InferSchemaType<typeof schema>;

const UserModel = mongoose.model('User', schema);

export {UserModel, User};
