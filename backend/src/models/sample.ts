import mongoose, {InferSchemaType} from "mongoose";

const schema = new mongoose.Schema({
    value: {
        type: Number,
        required: true
    },
    sensorId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false
});

type Sample = InferSchemaType<typeof schema>;
const SampleModel = mongoose.model('Sample', schema);

export {SampleModel, Sample};
