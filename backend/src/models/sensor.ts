import mongoose, {InferSchemaType} from "mongoose";
import {SENSOR} from "../types/entityTypes";

const schema = new mongoose.Schema({
    name: {
        type: String
    },
    tags: {
        type: [String]
    },
    description: {
        type: String
    },
    unit: {
        type: String
    },
    allowedUsers: {
        type: [String]
    },
    entityType: {
        type: String,
        default: SENSOR,
        immutable: true
    },
    location: {
        latitude: {
            type: Number
        },
        longitude: {
            type: Number
        },
        altitude: {
            type: Number
        }
    },
}, {
    timestamps: true
});

type Sensor = InferSchemaType<typeof schema>;

const SensorModel = mongoose.model('Sensor', schema);

export {SensorModel, Sensor};
